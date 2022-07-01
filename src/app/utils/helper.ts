import { HttpHeaders } from "@angular/common/http";
import { Filter, FilterPayload } from "app/models/FilterPayload";
import { environment } from "environments/environment";

export abstract class Helper {

  public static emailregex: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  public static getEmailRegex(): RegExp {
    return this.emailregex;
  }

  public static uriRegex: RegExp = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi
  public static getUriRegex(): RegExp {
    return this.uriRegex;
  }

  public static arraymove(arr: Array<any>, fromIndex: number, toIndex: number): Array<any> {
    var element = arr[fromIndex];
    arr.splice(fromIndex, 1);
    arr.splice(toIndex, 0, element);
    return arr;
  }

  public static setFilter(filter: FilterPayload, key: string) {
    sessionStorage.setItem(key, JSON.stringify(filter));
  }

  public static getFilter(key: string): FilterPayload {
    let ret: FilterPayload;
    ret = JSON.parse(sessionStorage.getItem(key));
    return ret;
  }

  public static removeFilterItem(key: string) {
    sessionStorage.removeItem(key);
  }

  public static cleanFilter() {
    sessionStorage.removeItem(environment.gmtSessionFilter);
  }

  //Rimappa gli operatori di devexpress in operatori conosciuti su as400
  public static GetOperator(_in: string): string {
    let _out: string = "";
    switch (_in) {
      case 'contains':
        return 'lke';
      case 'notcontains':
        return 'nlke';
      case 'startswith':
        return 'slke';
      case 'endswith':
        return 'elke';
      case '=':
        return 'eq';
      case '<>':
        return 'ne';

    }
    return _out;
  }

  //Rimappa gli operatori di devexpress in operatori conosciuti su as400
  public static GetDateOperator(_in: string): string {

    let _out: string = "";
    switch (_in) {
      case '<':
        return 'lt';
      case '>=':
        return 'gte';
      case 'lt':
        return 'lt';
      case 'gte':
        return 'gte';

    }
    return _out;
  }

  public static getIsoDate(date): string {
    try {
      return `${date.getFullYear()}-${("0" + (date.getMonth() + 1)).slice(-2)}-${("0" + date.getDate()).slice(-2)}`
    }
    catch {
      return "";
    }
  }

  public static makeAdditionalsFilters(loadOptions, dateFilters: string[]): Filter[] {
    // console.log(loadOptions);

    let additionalFilters = new Array<Filter>();
    try {

      // console.log(loadOptions.filter.length);
      if (loadOptions.filter) {
        if (loadOptions.filter.length == 2 && loadOptions.filter.filter(x => x == "!").length > 0) {
          let clause = loadOptions.filter[1];
          // console.log('0');

          if (dateFilters.find(x => x == clause[0])) {
            // Inverto l'operatore
            switch(clause[1])
            {
              case 'lt':
                clause[1] = 'gte';
                break;
              case 'gte':
                clause[1] = 'lt';
                break;
            }

            let value = '';
            if ((clause[2] instanceof Date)) {
              value = this.getIsoDate(clause[2]);
            }
            else if (typeof (clause[2]) == "number") {
              value = this.getIsoDate(new Date(clause[2]));
            }
            else {

              if (clause[2].length == 10) {
                value = clause[2];
              }
              else {
                var year = clause[2].substring(0, 4);
                var month = clause[2].substring(4, 6);
                var day = clause[2].substring(6, 8);
                value = year + '-' + month + '-' + day;
              }
            }

            let operator = Helper.GetDateOperator(clause[1]);
            if (loadOptions.filter[loadOptions.filter.indexOf(loadOptions.filter.filter(x => x.filter).filter(x => x[0] == clause[0])[0]) + 1] == 'or') {
              //Quando sulla griglia si seleziona "diverso" per le date, devexpress crea un array con 2 array e con l'operatore or al centro 
              //eg: [[...valore1], 'or', [...valore2]]
              //su as400 serve inserire l'operatore ne per il primo valore che compare, però va sempre controllato se sia date o string
              operator = 'ne';

              let temp = loadOptions.filter.filter(x => x.filter).filter(x => x[0] == clause[0])[0];

              if ((temp[2] instanceof Date)) {
                value = this.getIsoDate(temp[2]);
              }
              else if (typeof (temp[2]) == "number") {
                value = this.getIsoDate(new Date(temp[2]));
              }
              else {

                if (temp[2].length == 10) {
                  value = temp[2];
                }
                else {
                  var year = temp[2].substring(0, 4);
                  var month = temp[2].substring(4, 6);
                  var day = temp[2].substring(6, 8);
                  value = year + '-' + month + '-' + day;
                }
              }
            }

            let f: Filter = new Filter(clause[0], operator, value, null);
            additionalFilters.push(f);
          }
          else
          {
            //In questo caso, l'array di devexpress è composto da 2 elementi, il primo elemento indica la negazione del secondo elemento
            // let clause = loadOptions.filter[1];
            additionalFilters.push(new Filter(clause[0], "ne", clause[2], null));
          }
        }
        else if (loadOptions.filter.some(function (item) { return Array.isArray(item); })) {
          // console.log('1');
          //Ho più di un filtro, quindi loadOptions.filter avrà gli item negli elementi a indice pari. 
          loadOptions.filter.filter(function (element, index, array) {
            return (index % 2 === 0);
          }).forEach(elem => {

            if (Array.isArray(elem) && elem.filter(x => x == "!").length > 0) {
              //In questo caso bisogna "negare" la condizione espressa in elem[1]
              additionalFilters.push(new Filter(elem[1][0], "ne", elem[1][2], null));
            }
            else {
              if (elem.some(function (item) { return Array.isArray(item); })) {
                elem.filter(function (element, index, array) {
                  return (index % 2 === 0);
                }).forEach(elem2 => {

                  if (Array.isArray(elem2) && elem2.filter(x => x == "!").length > 0) {
                    //In questo caso bisogna "negare" la condizione espressa in elem[1]
                    additionalFilters.push(new Filter(elem2[1][0], "ne", elem2[1][2], null));
                  }
                  if (dateFilters.find(x => x == elem2[0])) {
                    ///La data se inserita al momento è stringa, se ricaricata dallo storage è date
                    ///Va comunque formattata rispetto a quanto si aspetta as400 (yyyy-MM-dd)
                    let value = '';
                    if ((elem2[2] instanceof Date)) {
                      value = this.getIsoDate(elem[2]);
                    }
                    else if (typeof (elem2[2]) == "number") {
                      value = this.getIsoDate(new Date(elem2[2]));
                    }
                    else {

                      if (elem2[2].length == 10) {
                        value = elem2[2];
                      }
                      else {
                        var year = elem2[2].substring(0, 4);
                        var month = elem2[2].substring(4, 6);
                        var day = elem2[2].substring(6, 8);
                        value = year + '-' + month + '-' + day;
                      }
                    }

                    let operator = Helper.GetDateOperator(elem2[1]);
                    if (elem[elem.indexOf(elem.filter(x => x.filter).filter(x => x[0] == elem2[0])[0]) + 1] == 'or') {
                      //Quando sulla griglia si seleziona "diverso" per le date, devexpress crea un array con 2 array e con l'operatore or al centro 
                      //eg: [[...valore1], 'or', [...valore2]]
                      //su as400 serve inserire l'operatore ne per il primo valore che compare, però va sempre controllato se sia date o string
                      operator = 'ne';

                      let temp = elem.filter(x => x.filter).filter(x => x[0] == elem2[0])[0];

                      if ((temp[2] instanceof Date)) {
                        value = this.getIsoDate(temp[2]);
                      }
                      else if (typeof (temp[2]) == "number") {
                        value = this.getIsoDate(new Date(temp[2]));
                      }
                      else {

                        if (temp[2].length == 10) {
                          value = temp[2];
                        }
                        else {
                          var year = temp[2].substring(0, 4);
                          var month = temp[2].substring(4, 6);
                          var day = temp[2].substring(6, 8);
                          value = year + '-' + month + '-' + day;
                        }
                      }
                    }

                    let f: Filter = new Filter(elem2[0], operator, value, null);
                    additionalFilters.push(f);
                  }
                  else {
                    let name = elem2[0];

                    //Utilizzo "IN" quando sto settando un custom HEADER FILTER, dal momento che sono tutti in "or", devono stare nel valuelist
                    if (elem2[1] == 'in') {
                      if (additionalFilters.find(x => x.name == name))
                        additionalFilters.find(x => x.name == name).valueList.push(elem2[2]);
                      else {
                        let f: Filter = new Filter(name, 'in', "", [elem2[2]]);
                        additionalFilters.push(f);
                      }
                    }
                    else {
                      let f: Filter = new Filter(name, Helper.GetOperator(elem2[1]), elem2[2], null);
                      additionalFilters.push(f);
                    }
                  }
                });
              }
              else {
                if (dateFilters.find(x => x == elem[0])) {
                  let value = '';
                  if ((elem[2] instanceof Date)) {
                    value = this.getIsoDate(elem[2]);
                  }
                  else if (typeof (elem[2]) == "number") {
                    value = this.getIsoDate(new Date(elem[2]));
                  }
                  else {

                    if (elem[2].length == 10) {
                      value = elem[2];
                    }
                    else {
                      var year = elem[2].substring(0, 4);
                      var month = elem[2].substring(4, 6);
                      var day = elem[2].substring(6, 8);
                      value = year + '-' + month + '-' + day;
                    }
                  }

                  let operator = Helper.GetDateOperator(elem[1]);
                  if (loadOptions.filter[loadOptions.filter.indexOf(loadOptions.filter.filter(x => x.filter).filter(x => x[0] == elem[0])[0]) + 1] == 'or') {
                    //Quando sulla griglia si seleziona "diverso" per le date, devexpress crea un array con 2 array e con l'operatore or al centro 
                    //eg: [[...valore1], 'or', [...valore2]]
                    //su as400 serve inserire l'operatore ne per il primo valore che compare, però va sempre controllato se sia date o string
                    operator = 'ne';

                    let temp = loadOptions.filter.filter(x => x.filter).filter(x => x[0] == elem[0])[0];

                    if ((temp[2] instanceof Date)) {
                      value = this.getIsoDate(temp[2]);
                    }
                    else if (typeof (temp[2]) == "number") {
                      value = this.getIsoDate(new Date(temp[2]));
                    }
                    else {

                      if (temp[2].length == 10) {
                        value = temp[2];
                      }
                      else {
                        var year = temp[2].substring(0, 4);
                        var month = temp[2].substring(4, 6);
                        var day = temp[2].substring(6, 8);
                        value = year + '-' + month + '-' + day;
                      }
                    }
                  }

                  let f: Filter = new Filter(elem[0], operator, value, null);
                  additionalFilters.push(f);
                }
                else {
                  let name = elem[0];

                  //Utilizzo "IN" quando sto settando un custom HEADER FILTER, dal momento che sono tutti in "or", devono stare nel valuelist
                  if (elem[1] == 'in') {
                    if (additionalFilters.find(x => x.name == name))
                      additionalFilters.find(x => x.name == name).valueList.push(elem[2]);
                    else {
                      let f: Filter = new Filter(name, 'in', "", [elem[2]]);
                      additionalFilters.push(f);
                    }
                  }
                  else {
                    let f: Filter = new Filter(name, Helper.GetOperator(elem[1]), elem[2], null);
                    additionalFilters.push(f);
                  }
                }
              }
            }
          });
        }
        else {
          // console.log('3a');

          //Ho solo un filtro, quindi loadOptions.filter avrà la colonna alla posizione 0, l'operatore alla posizione 1 e il valore alla posizione 2
          if (dateFilters.find(x => x == loadOptions.filter[0])) {
            ///La data se inserita al momento è stringa, se ricaricata dallo storage è date
            ///Va comunque formattata rispetto a quanto si aspetta as400 (yyyy-MM-dd)
            let value = '';
            if ((loadOptions.filter[2] instanceof Date)) {
              // console.log('3.1');
              value = this.getIsoDate(loadOptions.filter[2]);
              // console.log(value);
            }
            else if (typeof (loadOptions.filter[2]) == "number") {
              // console.log('3.2');
              value = this.getIsoDate(new Date(loadOptions.filter[2]));
            }
            else {
              // console.log('3.3');
              if (loadOptions.filter[2].length == 10) {
                // console.log('3.3.1');
                value = loadOptions.filter[2];
              }
              else {
                // console.log('3.3.2');
                var year = loadOptions.filter[2].substring(0, 4);
                var month = loadOptions.filter[2].substring(4, 6);
                var day = loadOptions.filter[2].substring(6, 8);
                value = year + '-' + month + '-' + day;
              }
            }

            let f: Filter = new Filter(loadOptions.filter[0], Helper.GetDateOperator(loadOptions.filter[1]), value, null);
            additionalFilters.push(f);
          }
          else {
            let name = loadOptions.filter[0];

            //Utilizzo "IN" quando sto settando un custom HEADER FILTER, dal momento che sono tutti in "or", devono stare nel valuelist
            if (loadOptions.filter[1] == 'in') {
              if (additionalFilters.find(x => x.name == name))
                additionalFilters.find(x => x.name == name).valueList.push(loadOptions.filter[2]);
              else {
                let f: Filter = new Filter(name, 'in', "", [loadOptions.filter[2]]);
                additionalFilters.push(f);
              }
            }
            else {
              let f: Filter = new Filter(name, Helper.GetOperator(loadOptions.filter[1]), loadOptions.filter[2], null);
              additionalFilters.push(f);
            }
          }
        }
      }

      return additionalFilters;
    }
    catch {
      return additionalFilters;
    }
  }
}