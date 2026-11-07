package com.hospital.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;

import com.hospital.entity.Department;
import com.hospital.repository.DepartmentRepository;

@RestController
@RequestMapping("/api/departments")
@CrossOrigin(origins="*")
public class DepartmentController {
	private final DepartmentRepository departmentRepository;

	public DepartmentController(
			DepartmentRepository departmentRepository) {
		this.departmentRepository = departmentRepository;
	}
	@PostMapping
	public ResponseEntity<Department> addDepartment(
            @Valid @RequestBody Department department) {

        if (departmentRepository.existsByDepartmentNameIgnoreCase(
                department.getDepartmentName())) {

            return ResponseEntity
                    .status(HttpStatus.CONFLICT)
                    .build();
        }

        Department savedDepartment =
                departmentRepository.save(department);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(savedDepartment);
    }
    @GetMapping
    public ResponseEntity<List<Department>> getAllDepartments() {

        return ResponseEntity.ok(
                departmentRepository.findAll()
        );
    }
    @GetMapping("/{id}")
    public ResponseEntity<Department> getDepartmentById(
            @PathVariable Long id) {

        return departmentRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
