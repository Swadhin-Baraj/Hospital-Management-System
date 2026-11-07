
package com.hospital.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.hospital.dto.DoctorRequest;
import com.hospital.entity.Doctor;
import com.hospital.service.DoctorService;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "*")
public class DoctorController {

    private final DoctorService doctorService;

    public DoctorController(DoctorService doctorService) {
        this.doctorService = doctorService;
    }

    // CREATE DOCTOR
    @PostMapping
    public ResponseEntity<Doctor> addDoctor(
            @Valid @RequestBody DoctorRequest request) {

        Doctor savedDoctor =
                doctorService.addDoctor(request);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDoctor);
    }

    // GET ALL DOCTORS
    @GetMapping
    public ResponseEntity<List<Doctor>> getAllDoctors() {

        return ResponseEntity.ok(
                doctorService.getAllDoctors()
        );
    }

    // GET DOCTOR BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Doctor> getDoctorById(
            @PathVariable Long id) {

        return ResponseEntity.ok(
                doctorService.getDoctorById(id)
        );
    }

    // UPDATE DOCTOR
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(
            @PathVariable Long id,
            @Valid @RequestBody DoctorRequest request) {

        return ResponseEntity.ok(
                doctorService.updateDoctor(id, request)
        );
    }

    // DELETE DOCTOR
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(
            @PathVariable Long id) {

        doctorService.deleteDoctor(id);

        return ResponseEntity.ok(
                "Doctor deleted successfully");
    }

    // SEARCH BY SPECIALIZATION
    @GetMapping("/search")
    public ResponseEntity<List<Doctor>> searchBySpecialization(
            @RequestParam String specialization) {

        return ResponseEntity.ok(
                doctorService.getDoctorsBySpecialization(
                        specialization)
        );
    }

    // SEARCH BY DEPARTMENT
    @GetMapping("/department/{departmentId}")
    public ResponseEntity<List<Doctor>> getDoctorsByDepartment(
            @PathVariable Long departmentId) {

        return ResponseEntity.ok(
                doctorService.getDoctorsByDepartment(
                        departmentId)
        );
    }
}
