package com.example.demo.repository;

import java.time.LocalDate;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.Trivias;

public interface TriviasRepository extends JpaRepository<Trivias, Integer> {
	Trivias findFirstByDate(LocalDate date);
}
