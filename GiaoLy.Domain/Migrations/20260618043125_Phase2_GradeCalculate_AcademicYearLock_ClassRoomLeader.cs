using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GiaoLy.Domain.Migrations
{
    /// <inheritdoc />
    public partial class Phase2_GradeCalculate_AcademicYearLock_ClassRoomLeader : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<double>(
                name: "AttendanceRate",
                table: "Grades",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<double>(
                name: "GPA",
                table: "Grades",
                type: "float",
                nullable: false,
                defaultValue: 0.0);

            migrationBuilder.AddColumn<bool>(
                name: "IsQualified",
                table: "Grades",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<Guid>(
                name: "LeaderId",
                table: "ClassRooms",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "IsArchived",
                table: "AcademicYears",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsLocked",
                table: "AcademicYears",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateIndex(
                name: "IX_ClassRooms_LeaderId",
                table: "ClassRooms",
                column: "LeaderId");

            migrationBuilder.AddForeignKey(
                name: "FK_ClassRooms_Users_LeaderId",
                table: "ClassRooms",
                column: "LeaderId",
                principalTable: "Users",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_ClassRooms_Users_LeaderId",
                table: "ClassRooms");

            migrationBuilder.DropIndex(
                name: "IX_ClassRooms_LeaderId",
                table: "ClassRooms");

            migrationBuilder.DropColumn(
                name: "AttendanceRate",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "GPA",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "IsQualified",
                table: "Grades");

            migrationBuilder.DropColumn(
                name: "LeaderId",
                table: "ClassRooms");

            migrationBuilder.DropColumn(
                name: "IsArchived",
                table: "AcademicYears");

            migrationBuilder.DropColumn(
                name: "IsLocked",
                table: "AcademicYears");
        }
    }
}
