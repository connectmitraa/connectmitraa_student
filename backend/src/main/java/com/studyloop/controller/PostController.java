package com.studyloop.controller;

import com.studyloop.model.Post;
import com.studyloop.model.PostComment;
import com.studyloop.repository.PostCommentRepository;
import com.studyloop.repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    @Autowired private PostRepository postRepository;
    @Autowired private PostCommentRepository postCommentRepository;

    @GetMapping
    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    @PostMapping
    public Post createPost(@RequestBody Post post) {
        if (post.getId() == null) {
            post.setId("post_" + System.currentTimeMillis());
        }
        return postRepository.save(post);
    }

    @PostMapping("/{id}/like")
    public ResponseEntity<Post> likePost(@PathVariable String id) {
        Optional<Post> postOpt = postRepository.findById(id);
        if (postOpt.isEmpty()) return ResponseEntity.notFound().build();

        Post p = postOpt.get();
        p.setLikes((p.getLikes() == null ? 0 : p.getLikes()) + 1);
        return ResponseEntity.ok(postRepository.save(p));
    }

    @GetMapping("/{id}/comments")
    public List<PostComment> getComments(@PathVariable String id) {
        return postCommentRepository.findByPostIdOrderByCreatedAtAsc(id);
    }

    @PostMapping("/{id}/comments")
    public PostComment addComment(@PathVariable String id, @RequestBody PostComment comment) {
        comment.setId("comm_" + System.currentTimeMillis());
        comment.setPostId(id);
        PostComment saved = postCommentRepository.save(comment);

        postRepository.findById(id).ifPresent(p -> {
            p.setCommentsCount((p.getCommentsCount() == null ? 0 : p.getCommentsCount()) + 1);
            postRepository.save(p);
        });

        return saved;
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable String id) {
        postRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
