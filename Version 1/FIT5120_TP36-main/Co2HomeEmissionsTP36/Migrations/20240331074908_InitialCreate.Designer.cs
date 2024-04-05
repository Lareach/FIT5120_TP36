﻿// <auto-generated />
using System;
using Co2HomeEmissionsTP36.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace Co2HomeEmissionsTP36.Migrations
{
    [DbContext(typeof(SavingsContext))]
    [Migration("20240331074908_InitialCreate")]
    partial class InitialCreate
    {
        /// <inheritdoc />
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "8.0.3")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder);

            modelBuilder.Entity("Co2HomeEmissionsTP36.Models.Concession", b =>
                {
                    b.Property<int>("ConcessionId")
                        .HasColumnType("int");

                    b.Property<string>("ConcessionName")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("Uid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Uid"));

                    b.HasKey("ConcessionId");

                    b.ToTable("concession");
                });

            modelBuilder.Entity("Co2HomeEmissionsTP36.Models.Savings", b =>
                {
                    b.Property<int>("SavingsId")
                        .HasColumnType("int");

                    b.Property<int?>("CategoryId")
                        .HasColumnType("int");

                    b.Property<string>("CtaUrl")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Description")
                        .HasMaxLength(255)
                        .HasColumnType("nvarchar(255)");

                    b.Property<string>("Duration")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("EligibilityRequirements")
                        .HasMaxLength(1000)
                        .HasColumnType("nvarchar(1000)");

                    b.Property<string>("Method")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<string>("Title")
                        .HasMaxLength(100)
                        .HasColumnType("nvarchar(100)");

                    b.Property<int>("Uid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Uid"));

                    b.HasKey("SavingsId");

                    b.HasIndex("CategoryId");

                    b.ToTable("savings");
                });

            modelBuilder.Entity("Co2HomeEmissionsTP36.Models.SavingsCategory", b =>
                {
                    b.Property<int>("CategoryId")
                        .HasColumnType("int");

                    b.Property<string>("CategoryName")
                        .HasMaxLength(50)
                        .HasColumnType("nvarchar(50)");

                    b.Property<int>("Uid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Uid"));

                    b.HasKey("CategoryId");

                    b.ToTable("category");
                });

            modelBuilder.Entity("Co2HomeEmissionsTP36.Models.SavingsConcession", b =>
                {
                    b.Property<int>("SavingsId")
                        .HasColumnType("int");

                    b.Property<int>("ConcessionId")
                        .HasColumnType("int");

                    b.Property<int>("Uid")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("Uid"));

                    b.HasKey("SavingsId", "ConcessionId");

                    b.HasIndex("ConcessionId");

                    b.ToTable("savingsConcession");
                });

            modelBuilder.Entity("Co2HomeEmissionsTP36.Models.Savings", b =>
                {
                    b.HasOne("Co2HomeEmissionsTP36.Models.SavingsCategory", "Category")
                        .WithMany()
                        .HasForeignKey("CategoryId");

                    b.Navigation("Category");
                });

            modelBuilder.Entity("Co2HomeEmissionsTP36.Models.SavingsConcession", b =>
                {
                    b.HasOne("Co2HomeEmissionsTP36.Models.Concession", "Concession")
                        .WithMany()
                        .HasForeignKey("ConcessionId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("Co2HomeEmissionsTP36.Models.Savings", "Savings")
                        .WithMany()
                        .HasForeignKey("SavingsId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Concession");

                    b.Navigation("Savings");
                });
#pragma warning restore 612, 618
        }
    }
}
