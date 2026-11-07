package com.hospital.service;

import java.util.List;
import org.springframework.stereotype.Service;

import com.hospital.entity.Patient;
import com.hospital.repository.PatientRepository;
import com.hospital.exception.ResourceNotFoundException;

@Service
public class PatientService {
	 private final PatientRepository patientRepository;

	    public PatientService(PatientRepository patientRepository) {
	        this.patientRepository = patientRepository;
	    }

	    // CREATE
	    public Patient registerPatient(Patient patient) {

	        return patientRepository.save(patient);
	    }

	    // READ ALL
	    public List<Patient> getAllPatients() {

	        return patientRepository.findAll();
	    }

	    // READ BY ID
	    public Patient getPatientById(Long id) {

	        return patientRepository.findById(id)
	                .orElseThrow(() ->
	                    new ResourceNotFoundException(
	                        "Patient not found with ID: " + id
	                    ));
	    }

	    // UPDATE
	    public Patient updatePatient(Long id, Patient updatedPatient) {

	        Patient existingPatient = getPatientById(id);

	        existingPatient.setName(updatedPatient.getName());
	        existingPatient.setAge(updatedPatient.getAge());
	        existingPatient.setGender(updatedPatient.getGender());
	        existingPatient.setPhone(updatedPatient.getPhone());
	        existingPatient.setAddress(updatedPatient.getAddress());

	        return patientRepository.save(existingPatient);
	    }

	    // DELETE
	    public void deletePatient(Long id) {

	        Patient existingPatient = getPatientById(id);

	        patientRepository.delete(existingPatient);
	    }
}
