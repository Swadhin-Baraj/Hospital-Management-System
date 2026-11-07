package com.hospital.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.dto.AppointmentRequest;
import com.hospital.entity.*;
import com.hospital.exception.ResourceNotFoundException;
import com.hospital.repository.*;

@Service
@Transactional
public class AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final PatientRepository patientRepository;
    private final DoctorRepository doctorRepository;

    public AppointmentService(
            AppointmentRepository appointmentRepository,
            PatientRepository patientRepository,
            DoctorRepository doctorRepository) {

        this.appointmentRepository = appointmentRepository;
        this.patientRepository = patientRepository;
        this.doctorRepository = doctorRepository;
    }

    // CHECK DATE AND TIME
    private void validateDateAndTime(AppointmentRequest request) {

        if (request.getAppointmentDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Appointment date cannot be in the past");
        }

        if (request.getAppointmentDate().equals(LocalDate.now())
                && !request.getAppointmentTime()
                        .isAfter(java.time.LocalTime.now())) {

            throw new IllegalArgumentException(
                    "Appointment time must be in the future");
        }
    }

    // CHECK AVAILABILITY
    private void checkAvailability(AppointmentRequest request) {

        boolean doctorBooked =
                appointmentRepository
                .existsByDoctor_DoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                        request.getDoctorId(),
                        request.getAppointmentDate(),
                        request.getAppointmentTime(),
                        AppointmentStatus.CANCELLED);

        if (doctorBooked) {
            throw new IllegalArgumentException(
                    "Doctor is already booked at this time");
        }

        boolean patientBooked =
                appointmentRepository
                .existsByPatient_PatientIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
                        request.getPatientId(),
                        request.getAppointmentDate(),
                        request.getAppointmentTime(),
                        AppointmentStatus.CANCELLED);

        if (patientBooked) {
            throw new IllegalArgumentException(
                    "Patient already has an appointment at this time");
        }
    }

    // CREATE APPOINTMENT
    public Appointment bookAppointment(AppointmentRequest request) {

        validateDateAndTime(request);

        Patient patient = patientRepository
                .findById(request.getPatientId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Patient not found with ID: "
                        + request.getPatientId()));

        Doctor doctor = doctorRepository
                .findById(request.getDoctorId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Doctor not found with ID: "
                        + request.getDoctorId()));

        checkAvailability(request);

        Appointment appointment = new Appointment();

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(
                request.getAppointmentDate());
        appointment.setAppointmentTime(
                request.getAppointmentTime());
        appointment.setReason(request.getReason());
        appointment.setStatus(AppointmentStatus.BOOKED);

        return appointmentRepository.save(appointment);
    }

    // GET ALL APPOINTMENTS
    @Transactional(readOnly = true)
    public List<Appointment> getAllAppointments() {

        return appointmentRepository.findAll();
    }

    // GET APPOINTMENT BY ID
    @Transactional(readOnly = true)
    public Appointment getAppointmentById(Long id) {

        return appointmentRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Appointment not found with ID: " + id));
    }

    // PATIENT APPOINTMENT HISTORY
    @Transactional(readOnly = true)
    public List<Appointment> getPatientAppointments(Long patientId) {

        if (!patientRepository.existsById(patientId)) {
            throw new ResourceNotFoundException(
                    "Patient not found with ID: " + patientId);
        }

        return appointmentRepository
                .findByPatient_PatientId(patientId);
    }

    // DOCTOR APPOINTMENT SCHEDULE
    @Transactional(readOnly = true)
    public List<Appointment> getDoctorAppointments(Long doctorId) {

        if (!doctorRepository.existsById(doctorId)) {
            throw new ResourceNotFoundException(
                    "Doctor not found with ID: " + doctorId);
        }

        return appointmentRepository
                .findByDoctor_DoctorId(doctorId);
    }

    // RESCHEDULE APPOINTMENT
    public Appointment rescheduleAppointment(
            Long id, AppointmentRequest request) {

        Appointment appointment = getAppointmentById(id);

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new IllegalArgumentException(
                    "Only booked appointments can be rescheduled");
        }

        validateDateAndTime(request);

        Patient patient = patientRepository
                .findById(request.getPatientId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Patient not found"));

        Doctor doctor = doctorRepository
                .findById(request.getDoctorId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Doctor not found"));

        boolean doctorBooked =
                appointmentRepository
                .existsByDoctor_DoctorIdAndAppointmentDateAndAppointmentTimeAndAppointmentIdNotAndStatusNot(
                        request.getDoctorId(),
                        request.getAppointmentDate(),
                        request.getAppointmentTime(),
                        id,
                        AppointmentStatus.CANCELLED);

        if (doctorBooked) {
            throw new IllegalArgumentException(
                    "Doctor is already booked at this time");
        }

        boolean patientBooked =
                appointmentRepository
                .existsByPatient_PatientIdAndAppointmentDateAndAppointmentTimeAndAppointmentIdNotAndStatusNot(
                        request.getPatientId(),
                        request.getAppointmentDate(),
                        request.getAppointmentTime(),
                        id,
                        AppointmentStatus.CANCELLED);

        if (patientBooked) {
            throw new IllegalArgumentException(
                    "Patient already has an appointment at this time");
        }

        appointment.setPatient(patient);
        appointment.setDoctor(doctor);
        appointment.setAppointmentDate(
                request.getAppointmentDate());
        appointment.setAppointmentTime(
                request.getAppointmentTime());
        appointment.setReason(request.getReason());

        return appointmentRepository.save(appointment);
    }

    // CANCEL APPOINTMENT
    public Appointment cancelAppointment(Long id) {

        Appointment appointment = getAppointmentById(id);

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new IllegalArgumentException(
                    "Only booked appointments can be cancelled");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);

        return appointmentRepository.save(appointment);
    }

    // COMPLETE APPOINTMENT
    public Appointment completeAppointment(Long id) {

        Appointment appointment = getAppointmentById(id);

        if (appointment.getStatus() != AppointmentStatus.BOOKED) {
            throw new IllegalArgumentException(
                    "Only booked appointments can be completed");
        }

        appointment.setStatus(AppointmentStatus.COMPLETED);

        return appointmentRepository.save(appointment);
    }

 // DELETE APPOINTMENT
    public void deleteAppointment(Long id) {

        Appointment appointment = getAppointmentById(id);

        appointmentRepository.delete(appointment);
    }
}
