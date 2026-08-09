package com.zynvora.flash_ticket_system.Service;

import java.math.BigDecimal;
import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import com.zynvora.flash_ticket_system.Dto.EventResponse;
import com.zynvora.flash_ticket_system.Entity.Event;
import com.zynvora.flash_ticket_system.Entity.EventType;
import com.zynvora.flash_ticket_system.Repository.EventRepository;
import com.zynvora.flash_ticket_system.Repository.EventTypeRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class AdminService {
    private final EventRepository eventRepository;
    private final EventTypeRepository eventTypeRepository;
    private final RedisTemplate<String, Integer> redisTemplate;

    public EventResponse addEvent(String event_name,String event_mode,Integer total_Seats,BigDecimal Price,LocalDateTime localDateTime ,String imageUrl){
        EventType type = eventTypeRepository.findByEventType(event_mode).orElseThrow(()-> new RuntimeException("This "+event_mode+" event type not found!"));
        
        LocalDateTime currenDateTime = LocalDateTime.now();
        DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy hh-mm a");
        String formatedCurrentDate = currenDateTime.format(dtf);
        String formatedEventDate = localDateTime.format(dtf);
        
        Event event = new Event();
        event.setEventName(event_name);
        event.setEvent_mode(type);
        event.setTotal_seats(total_Seats);
        event.setReserved_seats(total_Seats);
        event.setImageUrl(imageUrl);
        event.setEventAt(formatedEventDate);
        event.setCreatedAt(formatedCurrentDate);
        event.setTicket_price(Price);
        eventRepository.save(event);

        LocalDateTime eventDate = LocalDateTime.parse(event.getEventAt(), dtf);
        Duration ttl = Duration.between(LocalDateTime.now(), eventDate.plusHours(6));

        redisTemplate.opsForValue().set("event:"+event.getId()+":available",event.getReserved_seats(),ttl);

        EventResponse eventResponse = new EventResponse(event,"Successfully Created Event");
        return eventResponse;
    }

    public EventResponse deleteEvent(Long event_id){
        Event event = eventRepository.findById(event_id).orElseThrow(()->new RuntimeException("Event Not Found With This ID"));
        redisTemplate.delete("event:" + event_id + ":available");
        eventRepository.delete(event);
        EventResponse eventResponse = new EventResponse(event,"Successfully Deleted Event");
        return eventResponse;
    }

    public EventResponse updateEvent(Long id , Event updatedEvent){
        Event existingEvent = eventRepository.findById(id).orElseThrow(()->new RuntimeException("Event Not Found With This Id"));
        if (!existingEvent.getEventName().equalsIgnoreCase(updatedEvent.getEventName())) {
            existingEvent.setEventName(updatedEvent.getEventName());
        }
        if (!existingEvent.getEvent_mode().getId().equals(updatedEvent.getEvent_mode().getId())) {
            existingEvent.setEvent_mode(updatedEvent.getEvent_mode());
        }
        if (!existingEvent.getTotal_seats().equals(updatedEvent.getTotal_seats())) {
            existingEvent.setTotal_seats(updatedEvent.getTotal_seats());
        }
        
        if (existingEvent.getTicket_price().compareTo(updatedEvent.getTicket_price()) != 0) {
            existingEvent.setTicket_price(updatedEvent.getTicket_price());
        }
        if (!existingEvent.getEventAt().equalsIgnoreCase(updatedEvent.getEventAt())) {
            existingEvent.setEventAt(updatedEvent.getEventAt());
            DateTimeFormatter dtf = DateTimeFormatter.ofPattern("dd-MM-yyyy hh-mm a");
            LocalDateTime localDateTime = LocalDateTime.parse(updatedEvent.getEventAt(), dtf);
            Duration newTTL = Duration.between(LocalDateTime.now(), localDateTime.plusHours(6));

            if (!newTTL.isNegative() && !newTTL.isZero()) {
                redisTemplate.expire("event:" + id + ":available", newTTL);
            }
        }

        eventRepository.save(existingEvent);
        EventResponse eventResponse = new EventResponse(existingEvent,"Event has been Successfully Updated");
        return eventResponse;
    }

    public EventResponse getEvent(Long id){
        Event event = eventRepository.findById(id).orElseThrow(()->new RuntimeException("Event Not Found With This ID"));
        EventResponse eventResponse = new EventResponse(event,"Successfully Event Is Retrived");
        return eventResponse;
    }

    public List<Event> getAllEvents(){
        List<Event> events = eventRepository.findAll();
        return events;
    }

}
