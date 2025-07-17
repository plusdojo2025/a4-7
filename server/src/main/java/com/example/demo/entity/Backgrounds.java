package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "backgrounds")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Backgrounds {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer id;

	    @Lob
	    @Column(nullable = false, columnDefinition = "LONGBLOB")
	    private byte[] image;
}
