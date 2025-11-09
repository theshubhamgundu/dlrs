package com.dlrs.repository;

import com.dlrs.model.Property;
import com.dlrs.model.PropertyStatus;
import com.dlrs.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PropertyRepository extends JpaRepository<Property, Long> {
    Optional<Property> findByPropertyUid(String propertyUid);
    List<Property> findByOwner(User owner);
    List<Property> findByStatus(PropertyStatus status);
    
    @Query("SELECT p FROM Property p WHERE " +
           "(:propertyUid IS NULL OR p.propertyUid LIKE %:propertyUid%) AND " +
           "(:address IS NULL OR p.address LIKE %:address%) AND " +
           "(:ownerName IS NULL OR p.owner.fullName LIKE %:ownerName%) AND " +
           "(:minArea IS NULL OR p.area >= :minArea) AND " +
           "(:maxArea IS NULL OR p.area <= :maxArea)")
    List<Property> searchProperties(
        @Param("propertyUid") String propertyUid,
        @Param("address") String address,
        @Param("ownerName") String ownerName,
        @Param("minArea") Double minArea,
        @Param("maxArea") Double maxArea
    );
}

