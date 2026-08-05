package com.zynvora.flash_ticket_system.Service;

import java.util.concurrent.TimeUnit;

import org.redisson.api.RLock;
import org.redisson.api.RedissonClient;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.zynvora.flash_ticket_system.Dto.BookingResponse;
import com.zynvora.flash_ticket_system.Entity.Booking;
import com.zynvora.flash_ticket_system.Entity.Event;
import com.zynvora.flash_ticket_system.Entity.User;
import com.zynvora.flash_ticket_system.Repository.BookingRepository;
import com.zynvora.flash_ticket_system.Repository.EventRepository;
import com.zynvora.flash_ticket_system.Repository.UserRepository;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;

@Service
@Transactional
@RequiredArgsConstructor
public class UserService {

    private final EventRepository eventRepository;
    private final BookingRepository bookingRepository;
    private final RedisTemplate<String,Integer> redisTemplate;
    private final UserRepository userRepository;
    private final RedissonClient redissonClient;

    public BookingResponse addBooking(Long eventId , Integer seatsQuantity){
        Event event = eventRepository.findById(eventId).orElseThrow(()->new RuntimeException("Event Not Found With This ID"));
        String userEmail = SecurityContextHolder.getContext().getAuthentication().getName();
        User user = userRepository.findByEmail(userEmail).orElseThrow(()->new RuntimeException("User Not Found With This Email"));
        
        RLock lock = redissonClient.getLock("lock:event:"+event.getId());
        boolean redisUpdated = false;

        try {
            boolean locked = lock.tryLock(5, 30, TimeUnit.SECONDS);

            if (!locked) {
                throw new RuntimeException("Server is Busy Try Again in few Seconds");
            }

              if (seatsQuantity == null || seatsQuantity <= 0) {
                throw new RuntimeException("Seat quantity must be greater than zero");
            }

            Integer availableSeats = (Integer) redisTemplate.opsForValue().get("event:"+event.getId()+":available");
            if (availableSeats == null) {
                throw new RuntimeException("Seat cache not found");
            }
            if (availableSeats <= 0) {
                return new BookingResponse(null,"No Available Seats For Now");
            }

            if (availableSeats < seatsQuantity) {
                throw new RuntimeException("Only "+availableSeats+" are available");
            }

            redisTemplate.opsForValue().decrement("event:"+event.getId()+":available", seatsQuantity);
            redisUpdated = true;

            Booking booking = new Booking();
            booking.setEvent(event);
            booking.setUser(user);
            booking.setSeatQuantity(seatsQuantity);
            bookingRepository.save(booking);

            event.setReserved_seats(event.getReserved_seats() - seatsQuantity);
            eventRepository.save(event);
            BookingResponse response = new BookingResponse(booking,"Booking has been Successfull");
            return response;

        } catch (InterruptedException e) {
                Thread.currentThread().interrupt();
                if(redisUpdated){
                    redisTemplate.opsForValue().increment("event:"+event.getId()+":available", seatsQuantity);
                }
             throw new RuntimeException("Thread interrupted while acquiring lock", e);
        }catch(RuntimeException e){
            if(redisUpdated){
                    redisTemplate.opsForValue().increment("event:"+event.getId()+":available", seatsQuantity);
                }
             throw e;
        }finally{
            if (lock.isHeldByCurrentThread()) {
                lock.unlock();
            }
        }
        
    }
    
}
