package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.VacationBackgrounds;

public interface VacationBackgroundsRepository extends JpaRepository<VacationBackgrounds, Integer> {
	List<VacationBackgrounds> findByVacationSwitch(Integer vacationsId);
}
