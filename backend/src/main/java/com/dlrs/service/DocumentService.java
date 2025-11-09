package com.dlrs.service;

import com.dlrs.dto.DocumentResponse;
import com.dlrs.model.Document;
import com.dlrs.model.Property;
import com.dlrs.model.User;
import com.dlrs.repository.DocumentRepository;
import com.dlrs.repository.PropertyRepository;
import com.dlrs.repository.UserRepository;
import com.dlrs.util.FileUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class DocumentService {

    @Autowired
    private DocumentRepository documentRepository;

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileUtil fileUtil;

    @Autowired
    private AuditService auditService;

    @Value("${file.upload-dir}")
    private String uploadDir;

    @Transactional
    public DocumentResponse uploadDocument(Long propertyId, MultipartFile file, String username) throws Exception {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is the owner or admin
        if (!property.getOwner().getId().equals(user.getId()) && 
            !user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to upload documents for this property");
        }

        // Save file and calculate checksum
        String filePath = fileUtil.saveFile(file, uploadDir);
        String fileChecksum = fileUtil.calculateFileChecksum(file);

        Document document = new Document();
        document.setProperty(property);
        document.setFilePath(filePath);
        document.setFileChecksum(fileChecksum);
        document.setUploadedBy(user);

        document = documentRepository.save(document);

        auditService.logAction(user.getId(), "DOCUMENT_UPLOADED", 
                "Document uploaded for property: " + property.getPropertyUid());

        return toDocumentResponse(document);
    }

    public List<DocumentResponse> getDocumentsByPropertyId(Long propertyId) {
        List<Document> documents = documentRepository.findByPropertyId(propertyId);
        return documents.stream()
                .map(this::toDocumentResponse)
                .collect(Collectors.toList());
    }

    private DocumentResponse toDocumentResponse(Document document) {
        String fileName = document.getFilePath().substring(
                document.getFilePath().lastIndexOf("\\") + 1);
        
        return DocumentResponse.builder()
                .id(document.getId())
                .propertyId(document.getProperty().getId())
                .fileName(fileName)
                .filePath(document.getFilePath())
                .fileChecksum(document.getFileChecksum())
                .uploadedById(document.getUploadedBy().getId())
                .uploadedByName(document.getUploadedBy().getFullName())
                .uploadedAt(document.getUploadedAt())
                .build();
    }
}

