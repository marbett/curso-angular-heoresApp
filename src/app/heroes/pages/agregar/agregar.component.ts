import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-agregar',
  templateUrl: './agregar.component.html',
  styles: [
  ]
})
export class AgregarComponent implements OnInit {

  heroe: Heroe = {
    superhero: '',
    alter_ego: '',
    characters: '',
    first_appearance: '',
    publisher: Publisher.MarvelComics,
    alt_img: ''

  }

  publishers: Publisher[] = Object.values(Publisher) ;

  constructor(private heroesService: HeroesService,
              private activatedRoute: ActivatedRoute,
              private router: Router) { 

  }

  ngOnInit(): void {

    if (!this.router.url.includes('editar')) {
      return;
    }
    this.activatedRoute.params
        .pipe(
          switchMap( ({id}) => this.heroesService.getHeroePorId(id))
        )
        .subscribe( heroe => this.heroe = heroe)
  }

  guardar () {
    if (this.heroe.superhero.trim().length === 0) {
      return;
    }

    console.log(this.heroe.id);

    if (this.heroe.id) {
      this.heroesService.actualizarHeroe(this.heroe)
      .subscribe( heroe => console.log('Actualizando:', heroe))
    } else {
      this.heroesService.agregarHeroe(this.heroe)
      .subscribe( heroe => {
        console.log('Agregando:', heroe);
        this.router.navigate(['/heroes/editar', heroe.id]);
      })
    }
  }

  eliminar () {
    
      this.heroesService.eliminarHeroe(this.heroe.id!)
      .subscribe( resp => {
        console.log('Eliminando:', resp);
        this.router.navigate(['/heroes']);
      })
    
  }

}
