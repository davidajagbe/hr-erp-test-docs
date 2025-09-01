type AuditAction = {
  code: string;
  description: string;
};

export class AuditActions {
  static readonly AUTH: Record<
    | "SIGNUP"
    | "LOGIN"
    | "LOGOUT"
    | "FORGOT_PASSWORD"
    | "RESET_PASSWORD"
    | "OTP_VERIFICATION",
    AuditAction
  > = {
    SIGNUP: {
      code: "auth.signup",
      description: "User signup",
    },
    LOGIN: {
      code: "auth.login",
      description: "User login",
    },
    LOGOUT: {
      code: "auth.logout",
      description: "User logout",
    },
    FORGOT_PASSWORD: {
      code: "auth.forgot_password",
      description: "User requested password reset",
    },
    RESET_PASSWORD: {
      code: "auth.reset_password",
      description: "User reset password",
    },
    OTP_VERIFICATION: {
      code: "auth.otp_verification",
      description: "User verified OTP",
    },
  };

  static readonly USER: Record<"CREATED" | "UPDATED" | "DELETED", AuditAction> =
    {
      CREATED: {
        code: "user.created",
        description: "User created",
      },
      UPDATED: {
        code: "user.updated",
        description: "User updated",
      },
      DELETED: {
        code: "user.deleted",
        description: "User deleted",
      },
    };

  static readonly SLA: Record<"CREATED" | "UPDATED" | "DELETED", AuditAction> =
    {
      CREATED: {
        code: "sla.created",
        description: "SLA created",
      },
      UPDATED: {
        code: "sla.updated",
        description: "SLA updated",
      },
      DELETED: {
        code: "sla.deleted",
        description: "SLA deleted",
      },
    };

  static readonly CAMPAIGN: Record<
    | "CREATE"
    | "UPDATE"
    | "GET_ALL"
    | "GET_ONE"
    | "SOFT_DELETE"
    | "HARD_DELETE"
    | "UPDATE_ATTACHMENTS",
    AuditAction
  > = {
    CREATE: {
      code: "campaign.created",
      description: "Create Campaign",
    },
    GET_ALL: {
      code: "campaign.get_all",
      description: "Get All Campaigns",
    },
    GET_ONE: {
      code: "campaign.get_one",
      description: "Get Campaign by ID",
    },
    UPDATE: {
      code: "campaign.updated",
      description: "Update Campaign",
    },
    UPDATE_ATTACHMENTS: {
      code: "campaign.update_attachments",
      description: "Update Campaign Attachments",
    },
    SOFT_DELETE: {
      code: "campaign.soft_delete",
      description: "Soft Delete Campaign",
    },
    HARD_DELETE: {
      code: "campaign.hard_delete",
      description: "Hard Delete Campaign",
    },
  };

  static readonly CLIENT: Record<
    | "CREATE"
    | "GET_ALL"
    | "GET_ONE"
    | "GET_CAMPAIGNS"
    | "UPDATE"
    | "SOFT_DELETE"
    | "HARD_DELETE",
    AuditAction
  > = {
    CREATE: {
      code: "client.created",
      description: "Create Client",
    },
    GET_ALL: {
      code: "client.get_all",
      description: "Get All Clients",
    },
    GET_ONE: {
      code: "client.get_one",
      description: "Get Client by ID",
    },
    GET_CAMPAIGNS: {
      code: "client.get_campaigns",
      description: "Get Client Campaigns",
    },
    UPDATE: {
      code: "client.updated",
      description: "Update Client",
    },
    SOFT_DELETE: {
      code: "client.soft_delete",
      description: "Soft Delete Client",
    },
    HARD_DELETE: {
      code: "client.hard_delete",
      description: "Hard Delete Client",
    },
  };

  static readonly DEPARTMENT: Record<"CREATE" | "GET_ALL", AuditAction> = {
    CREATE: {
      code: "department.created",
      description: "Create Department",
    },
    GET_ALL: {
      code: "department.get_all",
      description: "Get All Departments",
    },
  };

  static readonly BUSINESS_ADVISORY: Record<
    "UPDATE_CAMPAIGN_STATUS" | "REQUEST_SLA",
    AuditAction
  > = {
    UPDATE_CAMPAIGN_STATUS: {
      code: "business_advisory.update_campaign_status",
      description: "Update campaign status from Business Advisory",
    },
    REQUEST_SLA: {
      code: "business_advisory.request_sla",
      description: "Request SLA for campaign",
    },
  };

  static readonly CCI: Record<
    | "ATTACH_SLA"
    | "GET_ALL_SLA_REQUESTS"
    | "GET_ONE_SLA_REQUEST"
    | "GET_DOCUMENTS"
    | "SEND_SLA_DOCUMENT"
    | "SOFT_DELETE_DOCUMENT"
    | "HARD_DELETE_DOCUMENT"
    | "SOFT_DELETE_SLA"
    | "HARD_DELETE_SLA",
    AuditAction
  > = {
    ATTACH_SLA: {
      code: "cci.attach_sla",
      description: "Attach SLA Document",
    },
    GET_ALL_SLA_REQUESTS: {
      code: "cci.get_all_sla_requests",
      description: "Get all SLA requests",
    },
    GET_ONE_SLA_REQUEST: {
      code: "cci.get_one_sla_request",
      description: "Get single SLA request by ID",
    },
    GET_DOCUMENTS: {
      code: "cci.get_documents",
      description: "Get SLA documents by SLA ID",
    },
    SEND_SLA_DOCUMENT: {
      code: "cci.send_sla_document",
      description: "Send SLA document to Business Advisory",
    },
    SOFT_DELETE_DOCUMENT: {
      code: "cci.soft_delete_document",
      description: "Soft delete SLA document",
    },
    HARD_DELETE_DOCUMENT: {
      code: "cci.hard_delete_document",
      description: "Hard delete SLA document",
    },
    SOFT_DELETE_SLA: {
      code: "cci.soft_delete_sla",
      description: "Soft delete SLA record",
    },
    HARD_DELETE_SLA: {
      code: "cci.hard_delete_sla",
      description: "Hard delete SLA record",
    },
  };

  static readonly STAFF: Record<
    "CREATE_ADMIN" | "CREATE_STAFF" | "COMPLETE_ONBOARDING",
    AuditAction
  > = {
    CREATE_ADMIN: {
      code: "staff.create_admin",
      description: "Create new admin staff",
    },
    CREATE_STAFF: {
      code: "staff.create_staff",
      description: "Create new staff member",
    },
    COMPLETE_ONBOARDING: {
      code: "staff.complete_onboarding",
      description: "Complete staff onboarding process",
    },
  };

  static readonly ATS: Record<
    "CREATE_ASSESSMENT" | "UPDATE_ASSESSMENT" | "DELETE_ASSESSMENT",
    AuditAction
  > = {
    CREATE_ASSESSMENT: {
      code: "ats.create_assessment",
      description: "Create new ATS assessment",
    },
    UPDATE_ASSESSMENT: {
      code: "ats.update_assessment",
      description: "Update ATS assessment",
    },
    DELETE_ASSESSMENT: {
      code: "ats.delete_assessment",
      description: "Delete ATS assessment",
    },
  };

  static readonly APPLICANT: Record<
    | "CREATE_WORK_EXPERIENCE"
    | "UPDATE_WORK_EXPERIENCE"
    | "DELETE_WORK_EXPERIENCE",
    AuditAction
  > = {
    CREATE_WORK_EXPERIENCE: {
      code: "applicant.work_experience_created",
      description: "Create Applicant Work Experience",
    },
    UPDATE_WORK_EXPERIENCE: {
      code: "applicant.work_experience_updated",
      description: "Update Applicant Work Experience",
    },
    DELETE_WORK_EXPERIENCE: {
      code: "applicant.work_experience_deleted",
      description: "Delete Applicant Work Experience",
    },
  };
}
