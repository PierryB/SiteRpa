'use client';
import { useUser } from "@auth0/nextjs-auth0/client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from 'react';

export default function Rpa() {
  const { user, isLoading } = useUser();
  const router = useRouter();

  if (isLoading) {
    return <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">Carregando...</div>;
  }

  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [formFields, setFormFields] = useState<{ [key: string]: string }>({});
  const options = ['Selecione uma automação', '1. Download PDF Católica', '2. Relatório FIPE'];

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleSelection = (option: string) => {
    setSelectedOption(option);

    if (option === 'Selecione uma automação') {
      setFormFields({});
    } else if (option === '1. Download PDF Católica') {
      setFormFields({ user: '', password: '' });
    } else if (option === '2. Relatório FIPE') {
      setFormFields({ mes: '' });
    }

    setIsOpen(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormFields(prevFields => ({
      ...prevFields,
      [field]: value
    }));
  };

  const handleExecute = () => {
    const emptyFields = Object.entries(formFields).filter(([_, value]) => !value);
  
    if (!selectedOption || selectedOption === 'Selecione uma automação') {
      setMessage('Erro: Selecione uma automação válida.');
    } else if (emptyFields.length > 0) {
      setMessage('Erro: Todos os campos devem ser preenchidos.');
    } else {
      setMessage(`Executando automação: ${selectedOption}.`);
  
      const url = 'http://localhost:3001/executar';
  
      // Dados a serem enviados no body da requisição
      const data = {
        parametro1: formFields.user || formFields.mes, // Aqui uso o campo adequado conforme a seleção
        parametro2: formFields.password || '',         // Se for a automação 1, envia a senha, caso contrário, pode enviar string vazia
      };
  
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data), // Envia os dados no corpo da requisição
      })
        .then((response) => {
          if (!response.ok) {
            return response.json().then((err) => {
              throw new Error(err.mensagem);
            });
          }
          return response.json();
        })
        .then((data) => {
          console.log('Success:', data);
          setMessage('Automação executada com sucesso.');
        })
        .catch((error) => {
          console.error('Error:', error);
          setMessage(`Erro ao executar a automação: ${error.message} ||| ${formFields.user} ||| ${formFields.password} ||| ${JSON.stringify(data)}`);
        });
    }
  
    setTimeout(() => {
      setMessage(null);
    }, 3000);
  };

  useEffect(() => {
    if (!user)
    {
      alert("Você precisa estar logado para acessar essa página.");
      router.push('/');
    }
    // else if (user?.email !== "test@test.com")
    // {
    //   alert("O seu usuário não tem acesso a essa página.");
    //   router.push('/');
    // }
  }, [user, router]);

  if (user) {
    return (
      <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center p-20 pb-20 font-[family-name:var(--font-geist-sans)]">
        <div className="mt-4 flex flex-col gap-8 row-start-4 items-center justify-center sm:items-start font-[family-name:var(--font-geist-mono)]" style={{ position: 'relative', display: 'inline-block', userSelect: 'none' }}>
          <div className="text-2xl" onClick={toggleDropdown} style={{ cursor: 'pointer', padding: '10px', border: '1px solid', borderRadius: '4px', width: '400px', textAlign: 'center' }}>
            {selectedOption ? selectedOption : 'Selecione uma automação'}
            <span style={{ marginLeft: '8px' }}>
              {isOpen ? '▲' : '▼'}
            </span>
          </div>

          {isOpen && (
            <ul className="flex flex-col row-start-4 items-center justify-center sm:items-start text-1xl font-[family-name:var(--font-geist-mono)]" style={{ top: '100%', left: '0', marginTop: '4px', padding: '0', listStyle: 'none', border: '1px solid', borderRadius: '4px', width: '100%' }}>
              {options.map((option) => (
                <li
                  key={option}
                  onClick={() => handleSelection(option)}
                  style={{ padding: '6px', cursor: 'pointer', width: '100%', boxSizing: 'border-box', textAlign: 'center', transition: 'all 200ms ease-in-out' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--foreground)';
                    e.currentTarget.style.color = 'var(--background)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'var(--background)';
                    e.currentTarget.style.color = 'var(--foreground)';
                  }}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}

          {selectedOption && selectedOption !== 'Selecione uma automação' && (
            <>
              <p
                className="row-start-5 p-8"
                style={{
                  userSelect: 'none',
                  textAlign: 'center'
                }}
              >
                Insira os parâmetros do RPA:
              </p>

              {/* Exibe campos para Download PDF Católica */}
              {selectedOption === '1. Download PDF Católica' && (
                <div className="flex flex-col grid row-start-6 items-center justify-center" style={{ width: '100%' }}>
                  <input 
                    type="text" 
                    placeholder="Usuário Católica" 
                    className="input-field" 
                    style={{ marginBottom: '10px', padding: '8px', width: '100%', borderRadius: '4px', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '2px solid var(--foreground)' }} 
                    value={formFields.user || ''}
                    onChange={(e) => handleInputChange('user', e.target.value)}
                  />
                  <input 
                    type="password" 
                    placeholder="Senha Católica" 
                    className="input-field" 
                    style={{ padding: '8px', width: '100%', borderRadius: '4px', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '2px solid var(--foreground)' }} 
                    value={formFields.password || ''}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                  />
                </div>
              )}

              {/* Exibe campos para Relatório FIPE */}
              {selectedOption === '2. Relatório FIPE' && (
                <div className="flex flex-col grid row-start-6 items-center justify-center" style={{ width: '100%' }}>
                  <input 
                    type="text" 
                    placeholder="Mês" 
                    className="input-field" 
                    style={{ marginBottom: '10px', padding: '8px', width: '100%', borderRadius: '4px', backgroundColor: 'var(--background)', color: 'var(--foreground)', border: '2px solid var(--foreground)' }} 
                    value={formFields.mes || ''}
                    onChange={(e) => handleInputChange('mes', e.target.value)}
                  />
                </div>
              )}
            </>
          )}
        </div>

        {selectedOption && selectedOption !== 'Selecione uma automação' && (
          <button
            className="row-start-7"
            onClick={handleExecute}
            style= {{
                marginTop: '30px',
                padding: '10px 20px',
                backgroundColor: 'var(--foreground)',
                color: 'var(--background)',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '16px',
                userSelect: 'none'
            }}
          >
            Executar
          </button>
        )}

        {message && (
          <div
          className="row-start-8"
          style= {{
              marginTop: '40px',
              padding: '10px',
              backgroundColor: message.startsWith('Erro') ? 'red' : 'green',
              borderRadius: '4px',
              textAlign: 'center',
            }}
          >
            {message}
          </div>
        )}
      </div>
    );
  }

  return null;
}
