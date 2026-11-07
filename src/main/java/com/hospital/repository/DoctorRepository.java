
package com.hospital.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.hospital.entity.Doctor;

@Repository
public interface DoctorRepository
        extends JpaRepository<Doctor, Long> {
	
	List<Doctor> findBySpecializationIgnoreCase(String specialization);
	
    List<Doctor> findByDepartmentDepartmentId(Long departmentId);

    boolean existsByEmailIgnoreCase(String email);
}
