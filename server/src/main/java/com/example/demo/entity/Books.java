package com.example.demo.entity;

import org.springframework.http.ResponseEntity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Lob;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Table(name="books")
public class Books {
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer id;
	private String author;
	private String name;
	private String overview;
	private Integer pages;
	@Lob
	@JsonIgnore
	private byte[] image;
	private Integer grade;
	@Transient // JPAを使用している場合、DBに永続化しないことを示す
	@JsonProperty("ImageData")
    private ResponseEntity<byte[]> ImageData; 
	
	
}
