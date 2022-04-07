using Microsoft.EntityFrameworkCore.Migrations;

namespace TeamBuilder.API.Migrations
{
    public partial class AppSettings : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AppSettings",
                table: "AppSettings");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "AppSettings");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppSettings",
                table: "AppSettings",
                columns: new[] { "MSTeamId", "Setting" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_AppSettings",
                table: "AppSettings");

            migrationBuilder.AddColumn<int>(
                name: "Id",
                table: "AppSettings",
                type: "INTEGER",
                nullable: false,
                defaultValue: 0)
                .Annotation("Sqlite:Autoincrement", true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppSettings",
                table: "AppSettings",
                column: "Id");
        }
    }
}
