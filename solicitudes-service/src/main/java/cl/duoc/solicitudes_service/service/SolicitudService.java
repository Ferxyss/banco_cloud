package cl.duoc.solicitudes_service.service;


import cl.duoc.solicitudes_service.entity.Solicitud;
import cl.duoc.solicitudes_service.repository.SolicitudRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;



@Service
public class SolicitudService {

    private final SolicitudRepository solicitudRepository;


    public SolicitudService(SolicitudRepository solicitudRepository) {
        this.solicitudRepository = solicitudRepository;
    }


    public Solicitud crearSolicitud(Solicitud solicitud) {
        solicitud.setEstado("PENDIENTE");
        solicitud.setFechaSolicitud(LocalDateTime.now());
        return solicitudRepository.save(solicitud);
    }


    public List<Solicitud> listarSolicitudes() {
        return solicitudRepository.findAll();
    }

    public Optional<Solicitud> buscarPorId(Long id) {
        return solicitudRepository.findById(id);
    }



    public Solicitud aprobarSolicitud(Long id) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        solicitud.setEstado("APROBADA");
        return solicitudRepository.save(solicitud);
    }



    public Solicitud rechazarSolicitud(Long id) {
        Solicitud solicitud = solicitudRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitud no encontrada"));
        solicitud.setEstado("RECHAZADA");
        return solicitudRepository.save(solicitud);
    }
}

