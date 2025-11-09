package com.dlrs.service;

import com.dlrs.dto.PropertyRequest;
import com.dlrs.dto.PropertyResponse;
import com.dlrs.model.Property;
import com.dlrs.model.PropertyStatus;
import com.dlrs.model.User;
import com.dlrs.repository.PropertyRepository;
import com.dlrs.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class PropertyService {

    @Autowired
    private PropertyRepository propertyRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuditService auditService;

    @Transactional
    public PropertyResponse createProperty(PropertyRequest request, String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Property property = new Property();
        property.setPropertyUid("PROP-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        property.setOwner(owner);
        property.setTitle(request.getTitle());
        property.setAddress(request.getAddress());
        property.setArea(request.getArea());
        property.setGisCoordinates(request.getGisCoordinates());
        property.setStatus(PropertyStatus.REGISTERED);

        property = propertyRepository.save(property);
        
        auditService.logAction(owner.getId(), "PROPERTY_CREATED", 
                "Property created: " + property.getPropertyUid());

        return toPropertyResponse(property);
    }

    public List<PropertyResponse> searchProperties(String propertyUid, String address, 
                                                   String ownerName, Double minArea, Double maxArea) {
        List<Property> properties = propertyRepository.searchProperties(
                propertyUid, address, ownerName, minArea, maxArea);
        return properties.stream()
                .map(this::toPropertyResponse)
                .collect(Collectors.toList());
    }

    public PropertyResponse getPropertyByUid(String propertyUid) {
        Property property = propertyRepository.findByPropertyUid(propertyUid)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        return toPropertyResponse(property);
    }

    public List<PropertyResponse> getPropertiesByOwner(String username) {
        User owner = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
        List<Property> properties = propertyRepository.findByOwner(owner);
        return properties.stream()
                .map(this::toPropertyResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public PropertyResponse updatePropertyStatus(Long propertyId, PropertyStatus status, String username) {
        Property property = propertyRepository.findById(propertyId)
                .orElseThrow(() -> new RuntimeException("Property not found"));
        
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!property.getOwner().getId().equals(user.getId()) && 
            !user.getRole().name().equals("ADMIN")) {
            throw new RuntimeException("Unauthorized to update this property");
        }

        property.setStatus(status);
        property = propertyRepository.save(property);
        
        auditService.logAction(user.getId(), "PROPERTY_STATUS_UPDATED", 
                "Property " + property.getPropertyUid() + " status updated to " + status);

        return toPropertyResponse(property);
    }

    private PropertyResponse toPropertyResponse(Property property) {
        return PropertyResponse.builder()
                .id(property.getId())
                .propertyUid(property.getPropertyUid())
                .ownerId(property.getOwner().getId())
                .ownerName(property.getOwner().getFullName())
                .ownerEmail(maskEmail(property.getOwner().getEmail()))
                .title(property.getTitle())
                .address(property.getAddress())
                .area(property.getArea())
                .gisCoordinates(property.getGisCoordinates())
                .status(property.getStatus())
                .createdAt(property.getCreatedAt())
                .build();
    }

    private String maskEmail(String email) {
        if (email == null || email.length() < 5) {
            return email;
        }
        String[] parts = email.split("@");
        if (parts.length != 2) {
            return email;
        }
        String localPart = parts[0];
        String domain = parts[1];
        if (localPart.length() <= 2) {
            return email;
        }
        String masked = localPart.substring(0, 2) + "***@" + domain;
        return masked;
    }
}

