package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "user_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserImages {
	 @Id
	    @GeneratedValue(strategy = GenerationType.IDENTITY)
	    private Integer id;

	    @ManyToOne
	    @JoinColumn(name = "user_id", nullable = false)
	    private Users user;

	    @Column(name = "image_type", nullable = false)
	    private String imageType;

	    @Column(name = "image_id", nullable = false)
	    private Integer imageId;
}
