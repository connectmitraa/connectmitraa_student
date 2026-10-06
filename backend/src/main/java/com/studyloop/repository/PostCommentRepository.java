package com.studyloop.repository;

import com.studyloop.model.PostComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostCommentRepository extends JpaRepository<PostComment, String> {
    List<PostComment> findByPostIdOrderByCreatedAtAsc(String postId);
}
