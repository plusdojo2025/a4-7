package com.example.demo.controller;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.example.demo.entity.Backgrounds;
import com.example.demo.repository.BackgroundsRepository;

@RestController
@RequestMapping("/backgrounds")
public class BackgroundsController {

    @Autowired
    private BackgroundsRepository backgroundsRepository;

    // 全背景情報を取得（idのみ）
    @GetMapping
    public List<Backgrounds> getAllBackgrounds() {
        return backgroundsRepository.findAll();
    }

    // IDで画像取得（バイナリ）
    @GetMapping("/{id}/image")
    public ResponseEntity<byte[]> getBackgroundImage(@PathVariable Integer id) {
        Optional<Backgrounds> bg = backgroundsRepository.findById(id);
        if (bg.isPresent()) {
            byte[] image = bg.get().getImage();
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.IMAGE_PNG); // 必要に応じてJPEG等に変更
            return new ResponseEntity<>(image, headers, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
    }

    // 画像の新規登録
    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Backgrounds> uploadBackground(@RequestParam("image") MultipartFile file) {
        try {
            Backgrounds background = Backgrounds.builder()
                    .image(file.getBytes())
                    .build();
            return ResponseEntity.ok(backgroundsRepository.save(background));
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // 背景の削除
    @DeleteMapping("/{id}")
    public void deleteBackground(@PathVariable Integer id) {
        backgroundsRepository.deleteById(id);
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<byte[]> getById(@PathVariable Integer id) {
        byte[] image = backgroundsRepository.findById(id).get().getImage();        
        return ResponseEntity.ok().contentType(MediaType.IMAGE_PNG).body(image);
		
    }
}
