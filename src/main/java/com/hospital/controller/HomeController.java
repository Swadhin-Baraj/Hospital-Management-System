package com.hospital.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class HomeController {
	
	@GetMapping("/")
	public String home() {
		return "WelCome to Hospital";
	}
	@GetMapping("/api/status")
	public String status() {
		return "Hospita Management Backend is Run";
	}
}
