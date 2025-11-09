package com.dlrs.repository;

import com.dlrs.model.Document;
import com.dlrs.model.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DocumentRepository extends JpaRepository<Document, Long> {
    List<Document> findByProperty(Property property);
    List<Document> findByPropertyId(Long propertyId);
}

