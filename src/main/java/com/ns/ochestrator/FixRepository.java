package com.ns.ochestrator;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface FixRepository extends JpaRepository<Fix, String> {
    List<Fix> findByIncident(Incident incident);
}
