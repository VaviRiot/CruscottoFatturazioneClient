import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { dashboard_garanzieComponent } from '../../dashboard_garanzie/dashboard_garanzie.component';
import { DetailProspectComponent } from '../../detail_prospect/detail_prospect.component';
import { InsolutiComponent } from '../../insoluti/insoluti.component';
import { DetailInsolutiComponent } from '../../detail_insoluti/detail_insoluti.component';
import { DetailUserComponent } from '../../detail_user/detail_user.component';
import { DetailRoleComponent } from '../../detail_role/detail_role.component';
import { ProspectComponent } from '../../prospect/prospect.component';
import { RoleWorkflowstepComponent } from '../../role_workflowstep/role_workflowstep.component';
import { DetailRoleWorkflowstepComponent } from '../../detail_role_workflowstep/detail_role_workflowstep.component';
import { RoleVocimenuComponent } from '../../role_vocimenu/role_vocimenu.component';
import { DetailRoleVocimenuComponent } from '../../detail_role_vocimenu/detail_role_vocimenu.component';
import { ScadenzeGaranzieComponent } from '../../scadenze_garanzie/scadenze_garanzie.component';
import { DetailScadenzeGaranzieComponent } from '../../detail_scadenze_garanzie/detail_scadenze_garanzie.component';
import { ChangePasswordComponent } from '../../change_password/change_password.component';

import { DetailNotificationComponent } from '../../detail_notification/detail_notification.component';
import { WorkflowsComponent } from '../../workflows/workflows.component';
import { DetailWorkflowComponent } from '../../detail_workflow/detail_workflow.component';
import { TypologicalsComponent } from '../../typologicals/typologicals.component';
import { DetailTypologicalComponent } from '../../detail_typological/detail_typological.component';
import { UsersComponent } from '../../users/users.component';
import { RolesComponent } from '../../roles/roles.component';
import { NotificationsComponent } from '../../notifications/notifications.component';
import { CustomersComponent } from '../../customers/customers.component';
import { TimelineComponent } from '../../components/timeline/timeline.component';

import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { UpgradeComponent } from '../../upgrade/upgrade.component';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';
import {MatRippleModule} from '@angular/material/core';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatSelectModule} from '@angular/material/select';

////Nicolò mura - angular material
import { MatAutocompleteModule } from '@angular/material/autocomplete'
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSliderModule } from '@angular/material/slider';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatRadioModule } from '@angular/material/radio';
import { WizardFormModule } from 'app/wizardform/wizard-form.module';

//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MglTimelineModule } from 'angular-mgl-timeline';

import { DxDataGridModule, DxDrawerModule, DxListModule, DxLoadIndicatorModule, DxRadioGroupModule, DxScrollViewModule, DxTemplateModule, DxToolbarModule } from 'devextreme-angular';

import { DatePipe } from '@angular/common';
import { SharedModule } from 'app/shared/shared.module';
import { DocumentUploadComponent } from 'app/modals/document_upload/document_upload.component';
import { ViewPdfComponent } from 'app/modals/view_pdf/view_pdf.component';
import { ViewMessageComponent } from 'app/modals/view_message/view_message.component';
import { ViewMailComponent } from 'app/modals/view_mail/view_mail.component';
import { ViewSaleTirComponent } from 'app/modals/view_sale_tir/view_sale_tir.component';
import { PipesModule, TimeAgoPipe } from 'app/utils/time-ago-pipe';

// DA RIMUOVERE
import { NotificationsGridComponent } from '../../notifications-grid/notifications-grid.component';

@NgModule({
  exports: [
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
  ]
})
export class MaterialModule {
}

@NgModule({
  imports: [
    WizardFormModule, ///Nicolò mura  => tutti i componenti dichiarati in declarations ora avranno accesso a wizard form module
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MaterialModule,
    DxLoadIndicatorModule,
    DxDataGridModule,
    DxTemplateModule,
    DxScrollViewModule,
    DxToolbarModule,
    DxDrawerModule,
    DxListModule,
    DxRadioGroupModule,
    // BrowserAnimationsModule,
    MglTimelineModule,
    PipesModule///Nicolò mura => tutti i componenti dichiarati avranno accesso a tutto il modulo material    
  ],
  declarations: [
    DashboardComponent,
    dashboard_garanzieComponent,
    DetailUserComponent,
    DetailRoleComponent,
    TableListComponent,
    TypographyComponent,
    IconsComponent,
    MapsComponent,
    UpgradeComponent,
    DetailProspectComponent,
    InsolutiComponent,
    DetailInsolutiComponent,
    DocumentUploadComponent,
    ViewPdfComponent,
    ViewMessageComponent,
    ViewMailComponent,
    ViewSaleTirComponent,
    DetailNotificationComponent,
    WorkflowsComponent,
    DetailWorkflowComponent,
    TypologicalsComponent,
    DetailTypologicalComponent,
    UsersComponent,
    ProspectComponent,
    RolesComponent,
    NotificationsComponent,
    NotificationsGridComponent,
    CustomersComponent,
    TimelineComponent,
    RoleWorkflowstepComponent,
    DetailRoleWorkflowstepComponent,
    RoleVocimenuComponent,
    DetailRoleVocimenuComponent,
    ScadenzeGaranzieComponent,
    DetailScadenzeGaranzieComponent,
    ChangePasswordComponent
  ],
  providers: [
    DatePipe,
    { provide: MAT_DIALOG_DATA, useValue: {modal: false} }
  ]
})

export class AdminLayoutModule {}
