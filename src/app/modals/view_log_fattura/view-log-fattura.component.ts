import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-view-log-fattura',
  templateUrl: './view-log-fattura.component.html',
  styleUrls: ['./view-log-fattura.component.css']
})
export class ViewLogFatturaComponent implements OnInit {
  displayedColumns: string[] = ['idFattura', 'statoFattura', 'date'];

  constructor(
    public dialogRef: MatDialogRef<ViewLogFatturaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) { }
  ngOnInit(): void {

  }

  getFattureState(state) {
    switch (state) {
      case 'V':
        return 'Validata';
      case 'R':
        return 'Rifiutata';
      case 'D':
        return 'Da Approvare';
      case 'C':
        return 'Contabilizzata';
      case 'G':
        return 'Rigettata da SAP';
      case 'S':
        return 'Validata da SAP';
      default:
        return 'In compilazione';
    }
  }


}
