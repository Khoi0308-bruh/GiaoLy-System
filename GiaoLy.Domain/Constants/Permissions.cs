namespace GiaoLy.Domain.Constants;

public static class Permissions
{
    public static class Users
    {
        public const string View = "users.view";
        public const string Create = "users.create";
        public const string Update = "users.update";
        public const string Delete = "users.delete";
        public const string AssignRole = "users.assign-role";
        public const string ResetPassword = "users.reset-password";
    }

    public static class Roles
    {
        public const string View = "roles.view";
        public const string Create = "roles.create";
        public const string Update = "roles.update";
        public const string Delete = "roles.delete";
        public const string Assign = "roles.assign";
    }

    public static class Students
    {
        public const string View = "students.view";
        public const string Create = "students.create";
        public const string Update = "students.update";
        public const string Delete = "students.delete";
        public const string Restore = "students.restore";
        public const string ChangeStatus = "students.change-status";
        public const string ViewContact = "students.view-contact";
        public const string ViewHealth = "students.view-health";
        public const string NotesWrite = "students.notes.write";
        public const string Import = "students.import";
        public const string Export = "students.export";
        public const string GuardiansLink = "guardians.link";
    }

    public static class Academic
    {
        public const string OrgManage = "org.manage";
        public const string View = "academic.view";
        public const string Create = "academic.create";
        public const string Update = "academic.update";
        public const string Delete = "academic.delete";
        public const string Lifecycle = "academic.lifecycle";
        public const string AssignTeachers = "classrooms.assign-teachers";
        public const string FamiliesManage = "families.manage";
    }

    public static class Enrollments
    {
        public const string View = "enrollments.view";
        public const string Manage = "enrollments.manage";
    }

    public static class Promotion
    {
        public const string View = "promotion.view";
        public const string Create = "promotion.create";
        public const string Decide = "promotion.decide";
        public const string Apply = "promotion.apply";
    }

    public static class Grades
    {
        public const string View = "grades.view";
        public const string Update = "grades.update";
        public const string Unlock = "grades.unlock";
        public const string Export = "grades.export";
    }

    public static class Sacraments
    {
        public const string View = "sacraments.view";
        public const string Update = "sacraments.update";
        public const string ManageRequirements = "sacraments.manage-requirements";
    }

    public static class Certificates
    {
        public const string View = "certificates.view";
        public const string Issue = "certificates.issue";
        public const string Revoke = "certificates.revoke";
    }

    public static class Camps
    {
        public const string View = "camps.view";
        public const string Manage = "camps.manage";
        public const string Register = "camps.register";
        public const string Collect = "camps.collect";
    }

    public static class Duty
    {
        public const string View = "duty.view";
        public const string Manage = "duty.manage";
    }

    public static class LessonPlans
    {
        public const string View = "lessonplans.view";
        public const string Manage = "lessonplans.manage";
        public const string ManageAll = "lessonplans.manage-all";
    }

    public static class Bouquets
    {
        public const string View = "bouquets.view";
        public const string Give = "bouquets.give";
        public const string Manage = "bouquets.manage";
    }

    public static class Announcements
    {
        public const string View = "announcements.view";
        public const string Create = "announcements.create";
        public const string Update = "announcements.update";
        public const string Delete = "announcements.delete";
    }

    public static class Documents
    {
        public const string View = "documents.view";
        public const string Create = "documents.create";
        public const string Update = "documents.update";
        public const string Delete = "documents.delete";
    }

    public static class Leaders
    {
        public const string View = "leaders.view";
        public const string Create = "leaders.create";
        public const string Update = "leaders.update";
        public const string Delete = "leaders.delete";
    }

    public static class Content
    {
        public const string BannersManage = "banners.manage";
    }

    public static class News
    {
        public const string View = "news.view";
        public const string Create = "news.create";
        public const string Update = "news.update";
        public const string Delete = "news.delete";
    }

    public static class Liturgical
    {
        public const string View = "liturgical.view";
        public const string Update = "liturgical.update";
    }

    public static class Reports
    {
        public const string View = "reports.view";
        public const string Export = "reports.export";
    }

    public static class Portal
    {
        public const string ChildrenView = "portal.children.view";
    }

    public static class Platform
    {
        public const string AuditView = "audit.view";
        public const string SettingsView = "settings.view";
        public const string SettingsManage = "settings.manage";
        public const string JobsView = "jobs.view";
        public const string JobsRun = "jobs.run";
    }

    public static readonly IReadOnlyList<string> All = typeof(Permissions)
        .GetNestedTypes()
        .SelectMany(t => t.GetFields().Where(f => f.IsLiteral).Select(f => (string)f.GetValue(null)!))
        .ToList();
}
