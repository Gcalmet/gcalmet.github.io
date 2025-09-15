---
layout: archive
title: "CV"
permalink: /cv/
author_profile: true
redirect_from:
  - /resume
---

{% include base_path %}

## Education

* Ph.D in Computational Biology, INSA de Lyon, 2028
* M.S. in Computer science, ENS de Lyon, 2025
* M.S. in Engineering, École Centrale de Lyon, 2025
* B.S. in Mathematics, Université Lyon 1, 2022

## Work experience

* Summer 2025: Research Intern
  
  * Inria de Lyon, Beagle Team, Guillaume Beslon
  * Subject : Numerical estimation of effective population size

* Summer 2024: Research Intern
  * Università di Trieste, ERALlab, Eric Medvet
  * Subject : Growing neural cellular automata

* Summer 2023: Research Intern
  * École Centrale de Lyon, LIRIS, Romain Vuillemot
  * Subject : Exploring new metrics in Table Tennis Analytics
  
## Skills

* Langage

  * French (native)
  * English (fluent)
  * German (B1)
  * Russian (A2)
  * Italian (A1)
  
* Coding

  * Python
  * C/C++
  * Latex/Typst/Markdown
  * Rust (a bit)

## Publications

  <ul>
    {% for post in site.publications reversed %}
      {% include archive-single-cv.html %}
    {% endfor %}
  </ul>
  
## Teaching

  <ul>
  {% for post in site.teaching reversed %}
    {% include archive-single-cv.html %}
  {% endfor %}
  </ul>
