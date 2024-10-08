﻿using DescarTec.Api.Models;
using DescarTec.Api.Models.Request;
using DescarTec.Api.Models.Response;

namespace DescarTec.Api.Core.Interfaces.Service
{
    public interface IRotaService
    {
        Task<DataResponse<bool>> IniciarRota(RotaRequest rotaRequest);
        Task<Rota?> GetRotaAtiva(Guid? userId = null);
        Task<DataResponse<bool>> EncerrarRotaAtiva(Guid? userId = null);
    }
}