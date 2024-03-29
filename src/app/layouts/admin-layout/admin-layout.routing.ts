import { Routes } from '@angular/router';
import { ProspectComponent } from '../../prospect/prospect.component';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { DetailUserComponent } from '../../detail_user/detail_user.component';
import { TableListComponent } from '../../table-list/table-list.component';
import { TypographyComponent } from '../../typography/typography.component';
import { IconsComponent } from '../../icons/icons.component';
import { MapsComponent } from '../../maps/maps.component';
import { DetailProspectComponent } from '../../detail_prospect/detail_prospect.component';
import { AuthGuardService } from '../../shared/Service/AuthGuard/auth-guard.service';
import { UserRoleEnum } from '../../models/Enum/UserRoleEnum';
import { Dashboard_insolutiComponent } from '../../dashboard_insoluti/dashboard_insoluti.component';
import { InsolutiComponent } from '../../insoluti/insoluti.component';
import { DetailInsolutiComponent } from '../../detail_insoluti/detail_insoluti.component';
import { UsersComponent } from '../../users/users.component';
import { RolesComponent } from '../../roles/roles.component';
import { DetailRoleComponent } from '../../detail_role/detail_role.component';
import { DetailNotificationComponent } from 'app/detail_notification/detail_notification.component';
import { NotificationsComponent } from 'app/notifications/notifications.component';
import { CustomersComponent } from 'app/customers/customers.component';
import { TimelineComponent } from 'app/components/timeline/timeline.component';
import { RoleWorkflowstepComponent } from 'app/role_workflowstep/role_workflowstep.component';
import { DetailRoleWorkflowstepComponent } from 'app/detail_role_workflowstep/detail_role_workflowstep.component';
import { RoleVocimenuComponent } from 'app/role_vocimenu/role_vocimenu.component';
import { DetailRoleVocimenuComponent } from 'app/detail_role_vocimenu/detail_role_vocimenu.component';
import { ScadenzeGaranzieComponent } from 'app/scadenze_garanzie/scadenze_garanzie.component';
import { DetailScadenzeGaranzieComponent } from 'app/detail_scadenze_garanzie/detail_scadenze_garanzie.component';
import { ChangePasswordComponent } from 'app/change_password/change_password.component';

export const AdminLayoutRoutes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dashboard',
      role: [
             UserRoleEnum.Admin,
             UserRoleEnum.Manager,
             UserRoleEnum.Ref_Area,
             UserRoleEnum.Uff_Crediti,
             UserRoleEnum.Uff_Garanzie,
             UserRoleEnum.BU_Legal
            ]
    }
  },
  { 
    path: 'fatture',
    component: ProspectComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Fatture',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'customers',
    component: CustomersComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Clienti',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { path: 'detail_prospect/:action/:id/:codiceCliente/:business/:stepIndex',
    component: DetailProspectComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dettaglio Prospect',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'users',
    component: UsersComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Utenti',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'detail_user/:action/:id',
    component: DetailUserComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dettaglio Utente',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'change_password',
    component: ChangePasswordComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Cambio Password Utente',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'roles',
    component: RolesComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Ruoli',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'detail_role/:action/:id',
    component: DetailRoleComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dettaglio Ruolo',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'role_workflowstep',
    component: RoleWorkflowstepComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Ruoli - Iter Approvativi',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'detail_role_workflowstep/:action/:id',
    component: DetailRoleWorkflowstepComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dettaglio Ruolo - Iter Approvativi',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'role_vocimenu',
    component: RoleVocimenuComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Ruoli - Voci Menu',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'detail_role_vocimenu/:action/:id',
    component: DetailRoleVocimenuComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dettaglio Ruolo - Voci Menu',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'scadenze_garanzie',
    component: ScadenzeGaranzieComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Scadenze Garanzie',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'detail_scadenze_garanzie/:action/:id',
    component: DetailScadenzeGaranzieComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dettaglio Scadenze Garanzie',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'notifications',
    component: NotificationsComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Notifiche',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'detail_notification/:action/:id',
    component: DetailNotificationComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dettaglio Notifica',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  {
    path: 'dashboard_insoluti',
    component: Dashboard_insolutiComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'dashboard_insoluti',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
    }
  },
  { path: 'dashboard_insoluti',
    component: DetailProspectComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dashboard Insoluti',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { 
    path: 'insoluti',
    component: InsolutiComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Lista Insoluti',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { path: 'detail_insoluti/:action/:id/:codiceCliente/:business/:stepIndex',
    component: DetailInsolutiComponent,
    canActivate: [AuthGuardService],
    data: {
      title: 'Dettaglio Insoluti',
      role: [
              UserRoleEnum.Admin,
              UserRoleEnum.Manager,
              UserRoleEnum.Ref_Area,
              UserRoleEnum.Uff_Crediti,
              UserRoleEnum.Uff_Garanzie,
              UserRoleEnum.BU_Legal
            ]
          }
  },
  { path: 'timeline', component: TimelineComponent },
  { path: 'table-list', component: TableListComponent },
  { path: 'typography', component: TypographyComponent },
  { path: 'icons', component: IconsComponent },
  { path: 'maps', component: MapsComponent }

];
