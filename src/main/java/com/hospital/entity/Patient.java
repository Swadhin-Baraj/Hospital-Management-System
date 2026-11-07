package com.hospital.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.persistence.Column;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

@Entity
@Table(name="patients")
public class Patient {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long patientId;
	
	@NotBlank(message="Patient name Required")
	@Column(nullable=false)
	private String name;
	
	@NotNull(message="Age is Required")
	@Min(value=1, message="Age must be atleast 1")
	@Max(value=120, message="Age can't exceed 120")
	private Integer age;
	
	@NotBlank(message="GenderR is equired")
	private String gender;
	
	@NotBlank(message="Phone Number is Required")
	@Pattern(regexp="^[0-9]{10}$",
	message="Number must contain 10 digit")
	private String phone;
	
	@NotBlank(message="Address")
	private String address;
	
	public Patient() {}

	public long getPatientId() {
		return patientId;
	}

	public void setPatientId(long patientId) {
		this.patientId = patientId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}

	public String getGender() {
		return gender;
	}

	public void setGender(String gender) {
		this.gender = gender;
	}

	public String getPhone() {
		return phone;
	}

	public void setPhone(String phone) {
		this.phone = phone;
	}

	public String getAddress() {
		return address;
	}

	public void setAddress(String address) {
		this.address = address;
	}
	
}









