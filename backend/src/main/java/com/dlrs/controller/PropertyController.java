package com.dlrs.controller;

import com.dlrs.dto.PropertyRequest;
import com.dlrs.dto.PropertyResponse;
import com.dlrs.model.PropertyStatus;
import com.dlrs.service.PropertyService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/properties")
@CrossOrigin(origins = "*")
public class PropertyController {

    @Autowired
    private PropertyService propertyService;

    @PostMapping
    public ResponseEntity<PropertyResponse> createProperty(
            @Valid @RequestBody PropertyRequest request,
            Authentication authentication) {
        String username = authentication.getName();
        PropertyResponse response = propertyService.createProperty(request, username);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<List<PropertyResponse>> searchProperties(
            @RequestParam(required = false) String propertyUid,
            @RequestParam(required = false) String address,
            @RequestParam(required = false) String ownerName,
            @RequestParam(required = false) Double minArea,
            @RequestParam(required = false) Double maxArea) {
        List<PropertyResponse> properties = propertyService.searchProperties(
                propertyUid, address, ownerName, minArea, maxArea);
        return ResponseEntity.ok(properties);
    }

    @GetMapping("/{propertyUid}")
    public ResponseEntity<PropertyResponse> getPropertyByUid(@PathVariable String propertyUid) {
        PropertyResponse property = propertyService.getPropertyByUid(propertyUid);
        return ResponseEntity.ok(property);
    }

    @GetMapping("/my-properties")
    public ResponseEntity<List<PropertyResponse>> getMyProperties(Authentication authentication) {
        String username = authentication.getName();
        List<PropertyResponse> properties = propertyService.getPropertiesByOwner(username);
        return ResponseEntity.ok(properties);
    }

    @PutMapping("/{propertyId}/status")
    public ResponseEntity<PropertyResponse> updatePropertyStatus(
            @PathVariable Long propertyId,
            @RequestParam PropertyStatus status,
            Authentication authentication) {
        String username = authentication.getName();
        PropertyResponse property = propertyService.updatePropertyStatus(propertyId, status, username);
        return ResponseEntity.ok(property);
    }
}

