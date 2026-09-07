package com.zynvora.flash_ticket_system.Controller;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.zynvora.flash_ticket_system.Dto.EventRequest;
import com.zynvora.flash_ticket_system.Dto.EventResponse;
import com.zynvora.flash_ticket_system.Entity.Event;
import com.zynvora.flash_ticket_system.Service.AdminService;

import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.GetMapping;



@RestController
@RequiredArgsConstructor
@RequestMapping("/admin")
public class adminController {

    private final AdminService adminService;
    
    @PostMapping(value = "/addEvent" , consumes = "multipart/form-data")
    public ResponseEntity<EventResponse> addEvent(@RequestPart("event") EventRequest request , @RequestPart("image") MultipartFile image) throws IOException{
        Path uploadPath = Paths.get("Uploads/events");
        Files.createDirectories(uploadPath);
        Path filePath = uploadPath.resolve(image.getOriginalFilename());
        Files.copy(image.getInputStream(),filePath,StandardCopyOption.REPLACE_EXISTING);
        String imageUrl = "uploads/events/" + image.getOriginalFilename();

        LocalDateTime eventDateTime = request.getLocalDateTime();
        String dateTimeString = (eventDateTime != null) ? eventDateTime.toString() : LocalDateTime.now().toString();


        EventResponse response =  adminService.addEvent(request.getEvent_name(),request.getEvent_mode(), request.getTotal_Seats(), request.getPrice(), dateTimeString,imageUrl);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @PutMapping("/update/{event_id}")
    public ResponseEntity<EventResponse> updateEvent(@PathVariable Long event_id, @RequestBody Event updatedEvent) {
        EventResponse response = adminService.updateEvent(event_id, updatedEvent);
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
    }

    @DeleteMapping("/delete/{eventId}")
    public ResponseEntity<EventResponse> deleteEvent(@PathVariable Long eventId){
        EventResponse response = adminService.deleteEvent(eventId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/event/{eventId}")
    public ResponseEntity<EventResponse> getEvent(@PathVariable Long eventId) {
        EventResponse response = adminService.getEvent(eventId);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/events")
    public ResponseEntity<List<Event>> getAllEvent() {
        List<Event> events = adminService.getAllEvents();
        return ResponseEntity.ok(events);
    }
    


    
}
