package com.dlrs.controller;

import com.dlrs.dto.DocumentResponse;
import com.dlrs.service.DocumentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/properties/{propertyId}/documents")
@CrossOrigin(origins = "*")
public class DocumentController {

    @Autowired
    private DocumentService documentService;

    @PostMapping("/upload")
    public ResponseEntity<DocumentResponse> uploadDocument(
            @PathVariable Long propertyId,
            @RequestParam("file") MultipartFile file,
            Authentication authentication) {
        try {
            String username = authentication.getName();
            DocumentResponse response = documentService.uploadDocument(propertyId, file, username);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping
    public ResponseEntity<List<DocumentResponse>> getDocuments(@PathVariable Long propertyId) {
        List<DocumentResponse> documents = documentService.getDocumentsByPropertyId(propertyId);
        return ResponseEntity.ok(documents);
    }
}

