package com.example.demo.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Books;
import com.example.demo.repository.BooksRepository;

@RestController
@RequestMapping("/book/")
public class BooksController {
	@Autowired
	private BooksRepository repository;
	
	// 画像の新規登録
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Books> uploadBook(@RequestParam("id") String id,@RequestPart("image") MultipartFile file) {
        try {
        	System.out.println(id);
        	int idInt=Integer.parseInt(id);
            Books book = repository.findById(idInt);
            book.setImage(file.getBytes());
            repository.save(book);
			return ResponseEntity.ok(repository.save(book));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
	
	@GetMapping("grade1/")
	private List<Books> getG1(){
		List<Books> data=repository.findByGrade(1);
		for(int i=0;i<data.size();i++) {
			ResponseEntity.BodyBuilder responseBuilder=ResponseEntity.ok();
			responseBuilder.contentType(MediaType.IMAGE_PNG);
			ResponseEntity<byte[]> response=responseBuilder.body(data.get(i).getImage());
			data.get(i).setImageData(response);
		}
        return data;
	}

	@GetMapping("grade2/")
	private List<Books> getG2(){
		List<Books> data=repository.findByGrade(2);
		for(int i=0;i<data.size();i++) {
			ResponseEntity.BodyBuilder responseBuilder=ResponseEntity.ok();
			responseBuilder.contentType(MediaType.IMAGE_PNG);
			ResponseEntity<byte[]> response=responseBuilder.body(data.get(i).getImage());
			data.get(i).setImageData(response);
		}
        return data;
	}
	
	@GetMapping("grade3/")
	private List<Books> getG3(){
		List<Books> data=repository.findByGrade(3);
		for(int i=0;i<data.size();i++) {
			ResponseEntity.BodyBuilder responseBuilder=ResponseEntity.ok();
			responseBuilder.contentType(MediaType.IMAGE_PNG);
			ResponseEntity<byte[]> response=responseBuilder.body(data.get(i).getImage());
			data.get(i).setImageData(response);
		}
        return data;
	}
	
	@GetMapping("grade4/")
	private List<Books> getG4(){
		List<Books> data=repository.findByGrade(4);
		for(int i=0;i<data.size();i++) {
			ResponseEntity.BodyBuilder responseBuilder=ResponseEntity.ok();
			responseBuilder.contentType(MediaType.IMAGE_PNG);
			ResponseEntity<byte[]> response=responseBuilder.body(data.get(i).getImage());
			data.get(i).setImageData(response);
		}
        return data;
	}
	
	@GetMapping("grade5/")
	private List<Books> getG5(){
		List<Books> data=repository.findByGrade(5);
		for(int i=0;i<data.size();i++) {
			ResponseEntity.BodyBuilder responseBuilder=ResponseEntity.ok();
			responseBuilder.contentType(MediaType.IMAGE_PNG);
			ResponseEntity<byte[]> response=responseBuilder.body(data.get(i).getImage());
			data.get(i).setImageData(response);
		}
        return data;
	}
	
	@GetMapping("grade6/")
	private List<Books> getG6(){
		List<Books> data=repository.findByGrade(6);
		for(int i=0;i<data.size();i++) {
			ResponseEntity.BodyBuilder responseBuilder=ResponseEntity.ok();
			responseBuilder.contentType(MediaType.IMAGE_PNG);
			ResponseEntity<byte[]> response=responseBuilder.body(data.get(i).getImage());
			data.get(i).setImageData(response);
		}
        return data;
	}
}
