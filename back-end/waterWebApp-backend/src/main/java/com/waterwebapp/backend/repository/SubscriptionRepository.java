package com.waterwebapp.backend.repository;

import com.waterwebapp.backend.entity.Subscription;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SubscriptionRepository extends JpaRepository<Subscription, Long> {
    java.util.List<Subscription> findByCompany_TaxNumber(String taxNumber);
}


