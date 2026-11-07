
package com.hospital.repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hospital.entity.Appointment;
import com.hospital.entity.AppointmentStatus;

@Repository
public interface AppointmentRepository
        extends JpaRepository<Appointment, Long> {

    // Find patient appointments
    List<Appointment> findByPatient_PatientId(Long patientId);

    // Find doctor appointments
    List<Appointment> findByDoctor_DoctorId(Long doctorId);

    // Find doctor's appointments on a particular date
    List<Appointment> findByDoctor_DoctorIdAndAppointmentDate(
            Long doctorId, LocalDate date);

    // Check doctor availability while booking
    boolean existsByDoctor_DoctorIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long doctorId,
            LocalDate date,
            LocalTime time,
            AppointmentStatus status);

    // Check patient availability while booking
    boolean existsByPatient_PatientIdAndAppointmentDateAndAppointmentTimeAndStatusNot(
            Long patientId,
            LocalDate date,
            LocalTime time,
            AppointmentStatus status);

    // Check doctor availability while rescheduling
    boolean existsByDoctor_DoctorIdAndAppointmentDateAndAppointmentTimeAndAppointmentIdNotAndStatusNot(
            Long doctorId,
            LocalDate date,
            LocalTime time,
            Long appointmentId,
            AppointmentStatus status);

    // Check patient availability while rescheduling
    boolean existsByPatient_PatientIdAndAppointmentDateAndAppointmentTimeAndAppointmentIdNotAndStatusNot(
            Long patientId,
            LocalDate date,
            LocalTime time,
            Long appointmentId,
            AppointmentStatus status);
}
