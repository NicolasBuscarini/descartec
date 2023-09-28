﻿using DescarTec.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace DescarTec.Api.Config.Context;

public class MySqlContext : IdentityDbContext<UserBase, ApplicationRole, Guid>
{
    public MySqlContext(DbContextOptions<MySqlContext> options) : base(options)
    {
    }

    public DbSet<ApplicationUser> User { get; set; } = null!;
    public DbSet<ColetorUser> ColetorUser { get; set; } = null!;
    public DbSet<ApplicationRole> Role { get; set; } = null!;
    public DbSet<Endereco> Endereco { get; set; } = null!;
    public DbSet<Notificacao> Notificacao { get; set; } = null!;
}