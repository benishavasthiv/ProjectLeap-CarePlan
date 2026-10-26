package com.careplan.careplan.service;

import com.careplan.careplan.entity.Appointment;
import com.careplan.careplan.repository.AppointmentRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;

    public AppointmentService(AppointmentRepository appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }

    public Appointment createAppointment(Appointment appointment) {
        return appointmentRepository.save(appointment);
    }

    public List<Appointment> getAllAppointments() {
        return appointmentRepository.findAll();
    }

    public Optional<Appointment> getAppointmentById(Long id) {
        return appointmentRepository.findById(id);
    }

    public Appointment updateAppointment(Long id, Appointment appointment) {
        Optional<Appointment> existing = appointmentRepository.findById(id);

        if (existing.isPresent()) {
            Appointment updated = existing.get();

            updated.setDoctorName(appointment.getDoctorName());
            updated.setAppointmentDate(appointment.getAppointmentDate());
            updated.setAppointmentTime(appointment.getAppointmentTime());
            updated.setReason(appointment.getReason());

            return appointmentRepository.save(updated);
        }

        return null;
    }

    public void deleteAppointment(Long id) {
        appointmentRepository.deleteById(id);
    }
}