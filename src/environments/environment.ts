// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  serverUrl: "http://localhost:8083/",
  keyRole: "ROLE",
  keyState: "STATE",
  keyUser: "USER",
  keyUserId: "USER_ID",
  keyToken: "TOKEN",
  keyNotify: "NOTIFY",
  keyBusiness: "AV_BUS",
  keySelectBusiness: "SEL_BUS",
  keyRedirectUrl: 'RED_URL',
  dayMaxCompleteDate: "7",
  prospectStatoAttivo: "Attivo",
  sottGaranzieDocName: "Sottoscrizione Garanzie",
  tipoRegistroEmailContratto: 'contratto',
  tipoRegistroEmailCanGar: 'canale_garanzia',
  tipoRegistroEmailAltraDoc: 'altra_documentazione',
  tipoRegistroEmailDerContratto: 'deroga_contratto',
  tipoRegistroEmailDerMerito: 'deroga_merito',
  gmtProspListFilter: 'gmt_pc_prospect_filter',
  gmtCliListFilter: 'gmt_pc_customer_filter',
  gmtCliPreListFilter: 'gmt_pc_customer_pre_filter',
  gmtNotListFilter: 'gmt_pc_notifiche_filter',
  gmtUserListFilter: 'gmt_pc_utenti_filter',
  gmtRoleListFilter: 'gmt_pc_ruoli_filter',
  gmtRoleWorkflowListFilter: 'gmt_pc_ruoli_work_filter',
  gmtRoleVociMenuListFilter: 'gmt_pc_ruoli_menu_filter',
  gmtScadenzaGaranzieListFilter: 'gmt_pc_scadenza_garanzie_filter',
  gmtSaleTirListFilter: 'gmt_pc_sale_tir_filter',
  gmtSessionFilter: 'gmt_pc_filter',
  gmtInsolutiListFilter: 'gmt_pc_insoluti_filter',
  publicUrls: ['/dashboard', '/detail_', '/change_password'],
  sorts: [
    {
      key: 'asc',
      value: 'Crescente'
    },
    {
      key: 'desc',
      value: 'Decrescente'
    }
  ]
};
