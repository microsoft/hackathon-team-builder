﻿// <auto-generated />
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TeamBuilder.API.Data;

namespace TeamBuilder.API.Migrations
{
    [DbContext(typeof(TeamBuilderDbContext))]
    [Migration("20220411192029_AddChannelId")]
    partial class AddChannelId
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "5.0.10");

            modelBuilder.Entity("TeamBuilder.Models.AppSetting", b =>
                {
                    b.Property<string>("MSTeamId")
                        .HasMaxLength(100)
                        .HasColumnType("TEXT");

                    b.Property<string>("Setting")
                        .HasMaxLength(50)
                        .HasColumnType("TEXT");

                    b.Property<string>("Value")
                        .IsRequired()
                        .HasMaxLength(250)
                        .HasColumnType("TEXT");

                    b.HasKey("MSTeamId", "Setting");

                    b.ToTable("AppSettings");
                });

            modelBuilder.Entity("TeamBuilder.Models.ChallengeArea", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<string>("Description")
                        .HasMaxLength(4000)
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("TEXT");

                    b.Property<string>("Prefix")
                        .IsRequired()
                        .HasMaxLength(12)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.ToTable("Challenges");
                });

            modelBuilder.Entity("TeamBuilder.Models.Team", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("INTEGER");

                    b.Property<int>("ChallengeAreaId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("ChannelId")
                        .HasColumnType("TEXT");

                    b.Property<string>("Description")
                        .HasMaxLength(4000)
                        .HasColumnType("TEXT");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(200)
                        .HasColumnType("TEXT");

                    b.HasKey("Id");

                    b.HasIndex("ChallengeAreaId");

                    b.ToTable("Teams");
                });

            modelBuilder.Entity("TeamBuilder.Models.TeamMember", b =>
                {
                    b.Property<int>("TeamId")
                        .HasColumnType("INTEGER");

                    b.Property<string>("UserId")
                        .HasColumnType("TEXT");

                    b.Property<bool>("IsLead")
                        .HasColumnType("INTEGER");

                    b.HasKey("TeamId", "UserId");

                    b.ToTable("TeamMembers");
                });

            modelBuilder.Entity("TeamBuilder.Models.Team", b =>
                {
                    b.HasOne("TeamBuilder.Models.ChallengeArea", "Challenge")
                        .WithMany("Teams")
                        .HasForeignKey("ChallengeAreaId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Challenge");
                });

            modelBuilder.Entity("TeamBuilder.Models.TeamMember", b =>
                {
                    b.HasOne("TeamBuilder.Models.Team", "Team")
                        .WithMany("TeamMembers")
                        .HasForeignKey("TeamId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Team");
                });

            modelBuilder.Entity("TeamBuilder.Models.ChallengeArea", b =>
                {
                    b.Navigation("Teams");
                });

            modelBuilder.Entity("TeamBuilder.Models.Team", b =>
                {
                    b.Navigation("TeamMembers");
                });
#pragma warning restore 612, 618
        }
    }
}
