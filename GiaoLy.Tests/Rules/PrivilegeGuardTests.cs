using GiaoLy.Domain.Rules;
using Xunit;

namespace GiaoLy.Tests.Rules;

public class PrivilegeGuardTests
{
    [Fact]
    public void CanAssignRole_ChiKhiMoiQuyenCuaVaiTroDichNamTrongQuyenCuaNguoiGan()
    {
        string[] assigner = ["students.view", "students.edit"];

        Assert.True(PrivilegeGuard.CanAssignRole("GiaoLyVien", assigner, ["students.view"]));
        Assert.False(PrivilegeGuard.CanAssignRole("GiaoLyVien", assigner, ["students.view", "roles.manage"]));
    }

    [Fact]
    public void CanAssignRole_SystemAdminKhongBiGioiHan()
    {
        Assert.True(PrivilegeGuard.CanAssignRole(PrivilegeGuard.SystemAdminRoleCode, [], ["roles.manage"]));
    }

    [Fact]
    public void CanGrantPermissions_ChanCapQuyenMinhKhongCo()
    {
        Assert.True(PrivilegeGuard.CanGrantPermissions("GiaoLyVien", ["grades.view"], ["grades.view"]));
        Assert.False(PrivilegeGuard.CanGrantPermissions("GiaoLyVien", ["grades.view"], ["grades.edit"]));
    }

    [Fact]
    public void CanModifyUser_KhongTuSuaChinhMinh()
    {
        var me = Guid.NewGuid();

        Assert.False(PrivilegeGuard.CanModifyUser(me, "GiaoLyVien", me, "GiaoLyVien"));
        Assert.True(PrivilegeGuard.CanModifyUser(me, PrivilegeGuard.SystemAdminRoleCode, Guid.NewGuid(), "GiaoLyVien"));
    }
}
