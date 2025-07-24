package com.example.demo.controller;

import java.io.IOException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Avatars;
import com.example.demo.repository.AvatarsRepository;

@RestController
@RequestMapping("/api/avatars")
public class AvatarsController {
	@Autowired
	private AvatarsRepository repo;
	
	// 画像の新規登録
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Avatars> uploadBackground(@RequestParam("image") MultipartFile file) {
        try {
        	Avatars avatar = Avatars.builder()
                    .image(file.getBytes())
                    .build();
            return ResponseEntity.ok(repo.save(avatar));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
	
	@GetMapping("{id}")
	public ResponseEntity<byte[]> get(@PathVariable("id") Integer id) {
		byte[] image = repo.findById(id).get().getImage();
		return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(image);
	}

}
