function autocomplete(inp, arr, inputId, inputValue) {
    var currentFocus;
    var withPair;

    inp.addEventListener("input", function (e) {
        var a, b, i, x, val = this.value;

        closeAllLists();

        if (!val) {
            return false;
        }

        currentFocus = -1;
        a = document.createElement("DIV");
        a.setAttribute("id", this.id + "autocomplete-list");
        a.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(a);

        withPair = false;
        for (i = 0; i < arr.length; i++) {
            $.each(arr[i], function (key, inputValueValue) {
                if (key == inputValue && inputValueValue.toUpperCase().includes(val.toUpperCase())) {
                    b = document.createElement("DIV");

                    var charPerInputValueValue = inputValueValue.split('');
                    for (x = 0; x < charPerInputValueValue.length; x++) {
                        if (x != inputValueValue.toUpperCase().indexOf(val.toUpperCase())) {
                            b.innerHTML += charPerInputValueValue[x];
                        } else {
                            b.innerHTML += "<strong>" + inputValueValue.substr(x, val.length) + "</strong>";
                            x += val.length - 1;
                        }
                    }

                    $.each(arr[i], function (key, inputIdValue) {
                        if (key == inputId) {
                            b.innerHTML += "<input type='hidden' " + inputId + "='" + inputIdValue +
                                "' value='" + inputValueValue + "'>";
                        }
                    });

                    b.addEventListener("click", function (e) {
                        inp.value = this.getElementsByTagName("input")[0].value;
                        inp.setAttribute(inputId, this.getElementsByTagName("input")[0].getAttribute(inputId));
                        $('#' + inp.getAttribute('id')).trigger('change');
                    });

                    a.appendChild(b);
                    withPair = true;
                }
            });
        }

        if (!withPair) {
            b = document.createElement("DIV");
            b.innerHTML += "No match found";
            a.appendChild(b);
        }
    });

    inp.addEventListener("keydown", function (e) {
        var x = document.getElementById(this.id + "autocomplete-list");

        if (x) {
            x = x.getElementsByTagName("div");
        }

        if (e.keyCode == 40) {
            currentFocus++;
            addActive(x);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(x);
        } else if (e.keyCode == 13) {
            e.preventDefault();

            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        } else if (e.keyCode == 9) {
            closeAllLists();
            
            if (currentFocus > -1) {
                if (x) x[currentFocus].click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        var x = document.getElementsByClassName("autocomplete-items");
        for (var i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }

    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}