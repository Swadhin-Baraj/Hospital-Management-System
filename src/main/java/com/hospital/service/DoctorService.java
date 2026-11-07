
package com.hospital.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.hospital.dto.DoctorRequest;
import com.hospital.entity.Department;
import com.hospital.entity.Doctor;
import com.hospital.repository.DepartmentRepository;
import com.hospital.repository.DoctorRepository;
import com.hospital.exception.ResourceNotFoundException;

@Service
@Transactional
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final DepartmentRepository departmentRepository;

    public DoctorService(
            DoctorRepository doctorRepository,
            DepartmentRepository departmentRepository) {

        this.doctorRepository = doctorRepository;
        this.departmentRepository = departmentRepository;
    }

    // CREATE DOCTOR
    public Doctor addDoctor(DoctorRequest request) {

        if (doctorRepository.existsByEmailIgnoreCase(
                request.getEmail())) {

            throw new IllegalArgumentException(
                    "Doctor email already exists");
        }

        Department department =
                departmentRepository.findById(
                        request.getDepartmentId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Department not found with ID: "
                        + request.getDepartmentId()
                    ));

        Doctor doctor = new Doctor();

        doctor.setName(request.getName());
        doctor.setSpecialization(request.getSpecialization());
        doctor.setQualification(request.getQualification());
        doctor.setExperienceYears(request.getExperienceYears());
        doctor.setPhone(request.getPhone());
        doctor.setEmail(request.getEmail());
        doctor.setConsultationFee(request.getConsultationFee());
        doctor.setDepartment(department);

        return doctorRepository.save(doctor);
    }

    // GET ALL DOCTORS
    @Transactional(readOnly = true)
    public List<Doctor> getAllDoctors() {

        return doctorRepository.findAll();
    }

    // GET DOCTOR BY ID
    @Transactional(readOnly = true)
    public Doctor getDoctorById(Long id) {

        return doctorRepository.findById(id)
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Doctor not found with ID: " + id
                    ));
    }

    // UPDATE DOCTOR
    public Doctor updateDoctor(
            Long id, DoctorRequest request) {

        Doctor existingDoctor = getDoctorById(id);

        if (!existingDoctor.getEmail().equalsIgnoreCase(
                request.getEmail())
                && doctorRepository.existsByEmailIgnoreCase(
                        request.getEmail())) {

            throw new IllegalArgumentException(
                    "Doctor email already exists");
        }

        Department department =
                departmentRepository.findById(
                        request.getDepartmentId())
                .orElseThrow(() ->
                    new ResourceNotFoundException(
                        "Department not found with ID: "
                        + request.getDepartmentId()
                    ));

        existingDoctor.setName(request.getName());
        existingDoctor.setSpecialization(
                request.getSpecialization());
        existingDoctor.setQualification(
                request.getQualification());
        existingDoctor.setExperienceYears(
                request.getExperienceYears());
        existingDoctor.setPhone(request.getPhone());
        existingDoctor.setEmail(request.getEmail());
        existingDoctor.setConsultationFee(
                request.getConsultationFee());
        existingDoctor.setDepartment(department);

        return doctorRepository.save(existingDoctor);
    }

    // DELETE DOCTOR
    public void deleteDoctor(Long id) {

        Doctor doctor = getDoctorById(id);

        doctorRepository.delete(doctor);
    }

    // SEARCH BY SPECIALIZATION
    @Transactional(readOnly = true)
    public List<Doctor> getDoctorsBySpecialization(
            String specialization) {

        return doctorRepository
                .findBySpecializationIgnoreCase(specialization);
    }

    // SEARCH BY DEPARTMENT
    @Transactional(readOnly = true)
    public List<Doctor> getDoctorsByDepartment(Long departmentId) {

        return doctorRepository
                .findByDepartmentDepartmentId(departmentId);
    }
}
