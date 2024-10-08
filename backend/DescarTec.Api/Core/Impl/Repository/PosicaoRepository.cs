﻿using DescarTec.Api.Config.Context;
using DescarTec.Api.Core.Interfaces.Repository;
using DescarTec.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace DescarTec.Api.Core.Impl.Repository
{
    public class PosicaoRepository : GenericRepository<Posicao, Guid>, IPosicaoRepository
    {
        private readonly MySqlContext _context;
        public PosicaoRepository(MySqlContext context) : base(context)
        {
            _context = context;
        }

        public async Task<List<Posicao>> ListPosicoesColetores()
        {
            List<Posicao> list = await _context.Posicao
                .Include(p => p.User)
                .Where(p => p.User.Discriminator == "ColetorUser")
                .ToListAsync();

            // Filtra as Posicoes com Rotas válidas
            return list;
        }
        public async Task<Posicao?> GetByUserIdAsync(Guid userId)
        {
            Posicao? result = await _context.Posicao.Where(u => userId == u.User.Id)
                .FirstOrDefaultAsync();

            return result;
        }
    }
}
