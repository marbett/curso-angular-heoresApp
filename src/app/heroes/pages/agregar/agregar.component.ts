import { Component, OnInit } from '@angular/core';
import { Heroe, Publisher } from '../../interfaces/heroes.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmarComponent } from '../../components/confirmar/confirmar.component';

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
              private router: Router,
              private snackbar: MatSnackBar,
              public dialog: MatDialog) { 

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
      .subscribe( heroe => this.mostrarSnackBar(`Registro ${heroe.superhero} actualizado`))
    } else {
      this.heroesService.agregarHeroe(this.heroe)
      .subscribe( heroe => {
        this.mostrarSnackBar(`Registro ${heroe.superhero} agregado`)
        this.router.navigate(['/heroes/editar', heroe.id]);
      })
    }
  }

  eliminar () {
    const dialog = this.dialog.open(ConfirmarComponent, {
        width: '250px',
        data: this.heroe
    });
    dialog.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.heroesService.eliminarHeroe(this.heroe.id!)
          .subscribe( resp => {
            this.mostrarSnackBar(`Registro eliminado`)
            this.router.navigate(['/heroes']);
          })
        }
      }
    )
  }

  mostrarSnackBar (mensaje: string): void {
    this.snackbar.open(mensaje, 'Cerrar', {
      duration: 2500
    })
  }

}
