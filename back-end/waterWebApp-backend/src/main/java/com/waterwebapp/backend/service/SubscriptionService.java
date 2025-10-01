package com.waterwebapp.backend.service;

import com.waterwebapp.backend.dto.SubscriptionDto;
import com.waterwebapp.backend.entity.Company;
import com.waterwebapp.backend.entity.Subscription;
import com.waterwebapp.backend.repository.CompanyRepository;
import com.waterwebapp.backend.repository.SubscriptionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
@Transactional
public class SubscriptionService {

    @Autowired
    private SubscriptionRepository subscriptionRepository;

    @Autowired
    private CompanyRepository companyRepository;

    public SubscriptionDto create(SubscriptionDto dto) {
        Subscription s = new Subscription();
        s.setFullName(dto.getFullName());
        s.setEmail(dto.getEmail());
        s.setPhone(dto.getPhone());
        if (dto.getCompanyTaxNumber() != null) {
            Optional<Company> company = companyRepository.findByTaxNumber(dto.getCompanyTaxNumber());
            company.ifPresent(s::setCompany);
        }
        Subscription saved = subscriptionRepository.save(s);
        SubscriptionDto out = new SubscriptionDto();
        out.setId(saved.getId());
        out.setFullName(saved.getFullName());
        out.setEmail(saved.getEmail());
        out.setPhone(saved.getPhone());
        out.setCompanyTaxNumber(dto.getCompanyTaxNumber());
        return out;
    }
}


