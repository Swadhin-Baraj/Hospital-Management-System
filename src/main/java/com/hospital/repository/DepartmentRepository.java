package com.hospital.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hospital.entity.Department;

@Repository
public interface DepartmentRepository
        extends JpaRepository<Department, Long> {

	boolean existsByDepartmentNameIgnoreCase(String departmentName);
	}
