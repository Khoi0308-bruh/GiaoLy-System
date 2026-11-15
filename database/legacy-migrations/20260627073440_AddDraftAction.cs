using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace GiaoLy.Domain.Migrations
{
    /// <inheritdoc />
    public partial class AddDraftAction : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "DraftActions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    TargetAcademicYearId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    StudentId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    SuggestedClassRoomId = table.Column<Guid>(type: "uniqueidentifier", nullable: true),
                    IsQualified = table.Column<bool>(type: "bit", nullable: false),
                    Reason = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_DraftActions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_DraftActions_AcademicYears_TargetAcademicYearId",
                        column: x => x.TargetAcademicYearId,
                        principalTable: "AcademicYears",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_DraftActions_ClassRooms_SuggestedClassRoomId",
                        column: x => x.SuggestedClassRoomId,
                        principalTable: "ClassRooms",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_DraftActions_Students_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Students",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_DraftActions_StudentId",
                table: "DraftActions",
                column: "StudentId");

            migrationBuilder.CreateIndex(
                name: "IX_DraftActions_SuggestedClassRoomId",
                table: "DraftActions",
                column: "SuggestedClassRoomId");

            migrationBuilder.CreateIndex(
                name: "IX_DraftActions_TargetAcademicYearId",
                table: "DraftActions",
                column: "TargetAcademicYearId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "DraftActions");
        }
    }
}
